from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Count

import json
from django.http import JsonResponse

from .models import User, Posts, Follow, Like
from .forms import NewPostForm



def index(request):
    NewPost_form = NewPostForm()
    return render(request, "network/index.html", {
        "NewPost_form": NewPost_form
    })

def post_page(request, filter_url):
    return render(request, "network/post-filtered-page.html", {
        "filter_url": filter_url
    })

def profile(request, username):

    user_profile = User.objects.get(username = username)
    print("user_prifile id= ", user_profile.id)

    # get posts of the profile-user
    posts = Posts.objects.filter(UserPosted = user_profile).order_by('-Timestamp')
    posts_count = posts.count()

    # paginate posts
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # count Follows
    follows = Follow.objects.filter(FollowedByUser = user_profile)
    follows_count = follows.count()

    # count Followers
    followers = Follow.objects.filter(UserFollowed = user_profile)
    followers_count = followers.count()

    # define Follow/Unfollow button msg
    button_msg = ""
    if request.user.is_authenticated:
        current_user = request.user
        print("current user = ", current_user)

        if Follow.objects.filter(UserFollowed = user_profile, FollowedByUser=current_user).exists():
            print("Condition check: current user ALREADY FOLLOWS this profile")
            button_msg = "Unfollow"
        else:
            button_msg = "Follow"

    return render(request, "network/profile.html", {
        "user_profile": user_profile,
        "posts": posts,
        "posts_count": posts_count,
        "follows_count": follows_count,
        "followers_count": followers_count,
        "button_msg": button_msg,
        "page_obj": page_obj
    })

@login_required
def follow_submit(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    current_user = request.user

    # Get JSON data
    data = json.loads(request.body)
    
    user_to_follow_id = int(data.get("user_profile_id", ""))
    user_profile = User.objects.get(pk = user_to_follow_id)

    # check if follow or unfollow
    if Follow.objects.filter(UserFollowed = user_profile, FollowedByUser=current_user).exists():
        print("Condition check: current user ALREADY FOLLOWS this profile")
        line_to_delete = Follow.objects.filter(UserFollowed = user_profile, FollowedByUser = current_user)
        line_to_delete.delete()
        print("user unfollowed")
    else:
        print("Condition check: current user DOES NOT this profile")
        line_to_add = Follow(
            UserFollowed = user_profile,
            FollowedByUser = current_user
        )
        line_to_add.save()
        print("user followed")

    return JsonResponse({"message": "User has been successfully followed/unfollowed"}, status=201)

   

@login_required
def create_new_post(request):

    print("Creat new post function is called")  # Debugging line
    
    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    

    # Get input
    data = json.loads(request.body)
    print("Data received:", data)  # Debugging line
    
    post_text = data.get("post_text", "")

    # Create a post
    post = Posts(
        PostText = post_text,
        UserPosted = request.user
    )

    post.save()

    return JsonResponse({"message": "Post created successfully."}, status=201)

@login_required
def edit(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get current user info
    current_user = request.user
    
    # Get input
    data = json.loads(request.body)

    post_id = data.get("id", "")
    new_post_text = data.get("post_text", "")

    # check that user is trying to update his/her own post
    post_to_be_edited = Posts.objects.get(id = post_id)
    print("post_to_be_edited: ", post_to_be_edited)

    post_creator_id = post_to_be_edited.UserPosted.id

    # check that user is attempting to edit his/her own post
    if post_creator_id != current_user.id:
        return JsonResponse({"error": "user is trying to edit other user post!"}, status=400)

    # update the post
    post_to_be_edited.PostText = new_post_text
    post_to_be_edited.save()

    return JsonResponse({"message": "Edit function succeded"}, status=201)


def posts_view(request):

    
    filter = request.GET.get('filter')
    page = request.GET.get('page')

    # Filter posts (all or from those who user follows)
    if filter == "all":
        posts = Posts.objects.all().annotate(like_count=Count('post_liked'))
    
    elif filter == "following":
        current_user = request.user
        users_followed = Follow.objects.filter(FollowedByUser = current_user).values_list('UserFollowed', flat=True)
        posts = Posts.objects.filter(UserPosted__in = users_followed).annotate(like_count=Count('post_liked'))
    
    elif filter.startswith('profile'):
        print('filter starts with Profile')
        user_profile_id = int(filter.split("profile:")[1])
        print("user_profile: ", user_profile_id)
        user_profile = User.objects.get(pk = user_profile_id)
        posts = Posts.objects.filter(UserPosted = user_profile).annotate(like_count=Count('post_liked'))
    
    else:
        return JsonResponse({"error": "Invalid mailbox."}, status=400)


    posts = posts.order_by("-Timestamp").all()

    # execute pagination
    # paginate posts by 10
    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(page)

    return JsonResponse({
        'posts':[post.serialize() for post in page_obj],
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number
    }, safe=False)


def display_like_icon(request):
    current_user = request.user

    post_id = request.GET.get('post_id')
    
    post = Posts.objects.get(pk = post_id)
    
    like = Like.objects.filter(PostLiked = post, LikedByUser = current_user)
    
    if like.exists():
        like_exists = True
    else:
        like_exists = False
   
    return JsonResponse({
        'like_exists': like_exists
    }, safe=False)

@login_required
def like(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    user = request.user

    # Get JSON data
    data = json.loads(request.body)
    post_id = int(data.get("id", ""))

    post = Posts.objects.get(pk = post_id)
    if Like.objects.filter(PostLiked = post, LikedByUser = user).exists():
        print ("this Post is already liked by the user")
        like = Like.objects.filter(PostLiked = post, LikedByUser = user)
        like.delete()
        print("like is deleted")
    else:
        like = Like(PostLiked = post, LikedByUser = user)
        like.save()
        print("like is saved")
    
    return JsonResponse({"message": "Like function succeded"}, status=201)



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
