from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length = 50)

    def __str__(self):
        return self.name

class Listing(models.Model):
    title = models.CharField(max_length = 50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name = "chosen_category")
    description = models.CharField(max_length = 500)
    start_price = models.IntegerField()
    time_created = models.DateTimeField(auto_now_add=True)
    pic = models.URLField(max_length = 1000)
    user_created = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "listing_creator", default=2)
    active = models.BooleanField(default=True)
    current_price = models.IntegerField(default=0)


    def __str__(self):
        return f"{self.id}: {self.title} in category {self.category.name} at intial price {self.start_price}$"

class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name = "chosen_listing")
    price = models.IntegerField()
    time_made = models.DateTimeField(auto_now_add=True)
    user_made = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "bid_creator", default=2)

    def __str__(self):
        return f"{self.price}$ for {self.listing.title} by {self.user_made.username}"

class Comment(models.Model):
    comment = models.CharField(max_length = 5000)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name = "commented_listing")
    user_made = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "comment_creator", default=2)

    def __str__(self):
        return f"{self.listing.title[:20]}: {self.comment[:50]}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "user_watchlist")
    listings = models.ManyToManyField(Listing, blank = True, related_name = "watchlist")

    def __str__(self):
        listing_titles = ", ".join([listing.title for listing in self.listings.all()])
        return f"{self.user.username} added to watchlist: {listing_titles}"
