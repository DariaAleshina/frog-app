from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Exists, OuterRef, Value, BooleanField, Case, When
from itertools import chain


import json, time
from django.http import JsonResponse

from .models import User, Set, Card, StarSet

# Create your views here.

def index(request):
    return render(request, "frogApp/index.html")

@login_required
def create_view(request):
    return render(request, "frogApp/createSet.html")

@login_required
def create_new_set(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get input
    data = json.loads(request.body)
    print("Data received:", data)  # Debugging line
    
    set_name = data.get("set_name", "")

    # additional check that input is no longet than 50 
    if len(set_name) > 50:
        return JsonResponse({"error": "Set Name is longer than 50 symbols."}, status=400)

    # check that user creates a unique set name 
    existing_sets = Set.objects.values_list('name', flat = True)
    if set_name in existing_sets:
        print("this user already has a set with this name")
        return JsonResponse({"error": "this user already has a set with this name"}, status=400)


    # Create a post
    set = Set(
        name = set_name,
        userCreated = request.user
    )

    set.save()

    return JsonResponse({"message": "New Set created successfully."}, status=201)


@login_required
def create_new_card(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)

    # get user
    user = request.user

    # get input
    data = json.loads(request.body)
    print("Data received:", data)  # Debugging line
    
    word = data.get("word", "")
    translation = data.get("translation", "")
    example = data.get("example", "")
    addInfo = data.get("addInfo", "")
    setTitle = data.get("setTitle", "")

    # add check that word & translation are not blank
    if not word.strip():
        return JsonResponse({"error": "Word cannot be blank"}, status=400)

    if not translation.strip():
        return JsonResponse({"error": "Translation cannot be blank"}, status=400)

    # get the Set data filtering by user! (raise error if Set does not exist)
    userSet = Set.objects.get(userCreated = user, name = setTitle)
    print("belons to set: ", userSet)

    # save the Card
    newCard = Card(
        word = word,
        translation = translation,
        example = example,
        addInfo = addInfo,
        fromSet = userSet
    )

    newCard.save()

    return JsonResponse({"message": "New Card created successfully"}, status=201)


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
            return render(request, "frogApp/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "frogApp/login.html")


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
            return render(request, "frogApp/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "frogApp/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "frogApp/register.html")

def load_cards(request):
    userId = request.GET.get('userId')
    setTitle = request.GET.get('setTitle')

    try: 
        # get user data
        userCreated = User.objects.get(pk=userId)

        # get set data
        fromSet = Set.objects.get(name = setTitle, userCreated = userCreated)

        # get card data
        cards = Card.objects.filter(fromSet = fromSet)
        cards = cards.order_by("-timestamp").all()

        # count cards
        cards_count = cards.count()


    except (User.DoesNotExist, Set.DoesNotExist, Card.DoesNotExist):
        cards = []
        cards_count = 0

    # return as JSON data
    return JsonResponse({
        'cards': [card.serialize() for card in cards],
        'cards_count': cards_count
    }, safe=False)

def set_view(request, set_id): 
    try:
        set_info = Set.objects.get(pk=set_id)

        set_starred = False
        
        if request.user.is_authenticated:
            user = request.user
            if (user.id != set_info.userCreated.id):
                try:
                    starred = StarSet.objects.get(setStarred = set_info, addedByUser = user)
                    set_starred = True
                except (StarSet.DoesNotExist):
                    set_starred = False

        print("set_starred", set_starred)

    except (Set.DoesNotExist):
        message = 'this FroSet does not exist or was deleted'
        return render(request, "frogApp/error.html", {
            "message":  message
        })

    return render(request, "frogApp/set_view.html", {
        "set_info": set_info,
        "set_starred": set_starred
    })

@login_required
def studyroom(request):

    return render(request, "frogApp/studyroom.html")


def load_sets(request):
    # get filter info
    filter = request.GET.get('filter')

    if filter == 'all_popular':
        try: 
            
            sets = Set.objects.all().annotate(
                card_count = Count('card_from_set', distinct=True),
                star_count = Count('set_starred', distinct=True),
                is_starred=Value(False, output_field=BooleanField())
            )
            
            sets = sets.order_by("-star_count", "-timestamp")

            # count sets
            sets_count = sets.count()

        except (Set.DoesNotExist):
                sets = []
                sets_count = 0


    # if filter starts with USER....
    if filter.startswith('user'):

        # get current user data
        user = request.user

        if filter == 'user_own':
            try: 
                # get user's own sets
                sets = Set.objects.filter(userCreated = user).annotate(
                    card_count = Count('card_from_set', distinct=True),
                    star_count = Count('set_starred', distinct=True),
                    is_starred=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=user))
                )
                sets = sets.order_by("-timestamp")

                # count sets
                sets_count = sets.count()

            except (Set.DoesNotExist):
                sets = []
                sets_count = 0

        if filter == 'user_starred':
            try:
                # get sets from users study list (starred)
                starred_sets_list = StarSet.objects.filter(addedByUser=user).values_list('setStarred', flat=True)
                sets = Set.objects.filter(id__in=starred_sets_list).annotate(
                    card_count = Count('card_from_set', distinct=True),
                    star_count = Count('set_starred', distinct=True),
                    is_starred=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=user))
                )
                sets = sets.order_by("-timestamp")

                # count sets
                sets_count = sets.count()

            except (Set.DoesNotExist, StarSet.DoesNotExist):
                sets = []
                sets_count = 0

        if filter == 'user_all':
            
            try: 
                own_sets = Set.objects.filter(userCreated = user).annotate(
                    card_count = Count('card_from_set', distinct=True),
                    star_count = Count('set_starred', distinct=True),
                    is_starred=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=user))
                )
            except:
                own_sets = []

            try:
                starred_sets_list = StarSet.objects.filter(addedByUser=user).values_list('setStarred', flat=True)
                starred_sets = Set.objects.filter(id__in=starred_sets_list).annotate(
                    card_count = Count('card_from_set', distinct=True),
                    star_count = Count('set_starred', distinct=True),
                    is_starred=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=user))
                )
            except:
                starred_sets = []
            
            sets = own_sets.union(starred_sets).order_by("-timestamp")
            sets_count = sets.count()

        if filter == 'user_popular':
            try: 
                sets = Set.objects.exclude(userCreated = user).annotate(
                    card_count = Count('card_from_set', distinct=True),
                    star_count = Count('set_starred', distinct=True),
                    is_starred=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=user))
                )
                sets = sets.order_by("-star_count", "-timestamp")
                sets_count = sets.count()
            except (Set.DoesNotExist): 
                sets = []
                sets_count = 0

    # if filter starts with PROFILE....
    if filter.startswith('profile'):
        profile_user_id = int(filter[len("profile_"):])
        print("profile_user_id: ", profile_user_id)

        try: 
            user_profile = User.objects.get(pk = profile_user_id)
            print("user_profile: ", user_profile)
            sets = Set.objects.filter(userCreated = user_profile).annotate(
                card_count = Count('card_from_set', distinct=True),
                star_count = Count('set_starred', distinct=True),
                is_starred=Case(
                    When(Value(request.user.is_authenticated), then=Exists(StarSet.objects.filter(setStarred=OuterRef('pk'), addedByUser=request.user))),
                    default=Value(False),
                    output_field=BooleanField()
                )
            )
            sets = sets.order_by("-star_count", "-timestamp")
            sets_count = sets.count()
        
        except (Set.DoesNotExist): 
            sets = []
            sets_count = 0

    # return as JSON data
    return JsonResponse({
        'sets': [set.serialize() for set in sets],
        'sets_count': sets_count
    }, safe=False)


@login_required
def star_set(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)

    # get user
    user = request.user

    # get input
    data = json.loads(request.body)
    print("Data received:", data)  # Debugging line
    
    set_id = data.get("id", "")
    set = Set.objects.get(pk=set_id)

    try:
        starred = StarSet.objects.get(setStarred = set, addedByUser = user)
        starred.delete()
        return JsonResponse({"message": f"SET {set.id} ({set.name})  was REMOVED from study-list successfully."}, status=201)
    
    except (StarSet.DoesNotExist):
        toaddset = StarSet(
            setStarred = set,
            addedByUser = user
        )
        toaddset.save()
        return JsonResponse({"message": f"SET {set.id} ({set.name}) was ADDED to study-list successfully."}, status=201)


@login_required   
def delete_card(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user = request.user

    # get input
    data = json.loads(request.body)
    print("Data received:", data)  # Debugging line
    
    card_id = data.get("id", "")
    card = Card.objects.get(pk=card_id)

    if (user.id != card.fromSet.userCreated.id):
        return JsonResponse({"error": "non-creator trying to delete a card"}, status=400)

    card.delete()

    return JsonResponse({"message": f"Card {card_id} was deleted"}, status=201)

@login_required
def edit_card(request):

    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user = request.user

    # get input
    data = json.loads(request.body)
    
    card_id = data.get("id", "")
    card = Card.objects.get(pk=card_id)

    if (user.id != card.fromSet.userCreated.id):
        return JsonResponse({"error": "non-creator trying to edit the card"}, status=400)

    card.word = data.get("word", "")
    card.translation = data.get("translation", "")
    card.example = data.get("example", "")
    card.addInfo = data.get("addInfo", "")
    card.save()

    return JsonResponse({"message": f"Card {card.id} was edited"}, status=201)

def profile(request, user_id):

    try:
        user = User.objects.get(pk=user_id)
        profile_userId = user.id
        profile_username = user.username
    
    except (User.DoesNotExist):
        message = 'this user does not exist'
        
        return render(request, "frogApp/error.html", {
            "message":  message
        })

    return render(request, "frogApp/profile.html", {
        "profile_userId": profile_userId,
        "profile_username": profile_username
    })



    

