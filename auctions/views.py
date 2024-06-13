from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required

from .models import User, Category, Listing, Bid, Comment, Watchlist
from .forms import CommentForm, BidForm, NewListingForm



def index(request):
    active = True
    listings = Listing.objects.filter(active=active)
    return render(request, "auctions/index.html", {
        "listings":listings
    })


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create(request):
    #load list of Categories for the form
    categories = Category.objects.all()
    new_listing_form = NewListingForm()
    

    if request.method == "POST":

        new_listing_form = NewListingForm(request.POST)

        if new_listing_form.is_valid():
            user_id = request.user.id
            user_created = User.objects.get(pk=user_id)

            title = new_listing_form.cleaned_data["title"]
            
            category = new_listing_form.cleaned_data["category"]
            
            description = new_listing_form.cleaned_data["description"]
            start_price = int(new_listing_form.cleaned_data["price"])
            current_price = start_price
            pic = new_listing_form.cleaned_data["picture_url"]

            listing = Listing.objects.create(title=title, category=category, description=description, start_price=start_price, current_price=current_price, pic=pic, user_created=user_created)
            
            return HttpResponseRedirect(reverse("listings", kwargs={"listing_id": listing.id}))
        else: 
            print("form problem:")
            print(new_listing_form.errors)
    
    return render(request, "auctions/create.html", {
    "categories": categories,
    "new_listing_form": new_listing_form
    })
  

def listings(request, listing_id):

    listing = Listing.objects.get(pk=listing_id)
    existing_comments = Comment.objects.filter(listing=listing)
    bid_error_message = ""
    watchlist_button_message = ""
    winning_bid = []

    if request.user.is_authenticated:
        in_watchlist = False
        user_id = request.user.id
        user = User.objects.get(pk=user_id)
        try:
            watchlist = Watchlist.objects.get(user=user)
            listings_in_watchlist = watchlist.listings.all()
                
        except Watchlist.DoesNotExist:
            listings_in_watchlist = []
           
        for listing_in_watchlist in listings_in_watchlist:
            if listing_in_watchlist.id == listing_id:
                in_watchlist = True

        if in_watchlist:
            watchlist_button_message = "Remove from Watchlist"
        else:
            watchlist_button_message = "Add to Watchlist"

        

    if request.method == "POST":

        if 'listing_close' in request.POST:
            if listing.active == True:
                listing.active = False
                listing.save()
            else: 
                listing.active = True
                listing.save()


        if 'watchlist_button' in request.POST:
            if not in_watchlist:
                watchlist.listings.add(listing)
                watchlist_button_message = "Remove from Watchlist"
            else: 
                watchlist.listings.remove(listing)
                watchlist_button_message = "Add to Watchlist"


        if 'submit_comment_button' in request.POST:
            comment_form = CommentForm(request.POST)
            if comment_form.is_valid():
                comment = comment_form.cleaned_data["comment"]
                Comment.objects.create(comment=comment, listing=listing, user_made=user)
        
        if 'submit_bid_button' in request.POST:
            bid_form = BidForm(request.POST)
            if bid_form.is_valid():
                price = bid_form.cleaned_data["bid"]

                if price == listing.start_price:
                    if not Bid.objects.filter(listing=listing):
                        Bid.objects.create(price=price, listing=listing, user_made=user)
                    else: bid_error_message = "Your bid should be higher, than the current price"
                elif price > listing.current_price:
                    Bid.objects.create(price=price, listing=listing, user_made=user)
                else: 
                    bid_error_message = "Your bid should be higher, than the current price"
            else: 
                bid_error_message = "Not valid bid input"

    
    #upload count of listing bids 
    bid_count = Bid.objects.filter(listing=listing).count()

    #update current price just in case DB was changed
    latest_bid = Bid.objects.filter(listing=listing).order_by('-price').first()
    if not latest_bid:
        listing.current_price = listing.start_price
    else: 
        listing.current_price = latest_bid.price
        listing.save()

    #if the listing inactive check for winner
    if request.user.is_authenticated:
        if not listing.active:
            try:
                winning_bid = Bid.objects.filter(listing=listing).order_by('-price').first()
            except Bid.DoesNotExist:
                winning_bid = []


    #upload all the forms for this page
    comment_form = CommentForm()
    bid_form = BidForm()

    return render(request, "auctions/listings.html", {
    "listing":listing,
    "comments":existing_comments,
    "comment_form": comment_form,
    "bid_form": bid_form,
    "bid_error_message": bid_error_message,
    "bid_count": bid_count,
    "watchlist_button_message": watchlist_button_message,
    "winning_bid": winning_bid
    })

@login_required
def watchlist(request):


    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    try:
        watchlist = Watchlist.objects.get(user=user)
        listings = watchlist.listings.all()
        count = watchlist.listings.all().count()
    except Watchlist.DoesNotExist:
        listings = []
        count = 0

    return render(request, "auctions/watchlist.html", {
        "listings": listings,
        "count": count
    })

def categories(request):
    categories = Category.objects.all().order_by('name')


    return render(request, "auctions/categories.html", {
        "categories": categories
    })

def category(request, category_name):
    category = Category.objects.get(name=category_name)

    try:
        listings = Listing.objects.filter(category=category, active=True)
        count = listings.count()
    except:
        listings = []
        count = 0

    return render(request, "auctions/category.html", {
        "category": category,
        "listings": listings,
        "count": count
    })