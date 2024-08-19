from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator



class User(AbstractUser):
    pass

class Posts(models.Model):
    PostText = models.CharField(max_length = 140, validators=[MinLengthValidator(0), MaxLengthValidator(140)])
    UserPosted = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "post_creator")
    Timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "post_text": self.PostText,
            "creator": self.UserPosted.username,
            "creator_id": self.UserPosted.id,
            "timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_count": self.like_count
        }

    def __str__(self):
        return f"{self.UserPosted} posted '{self.PostText[:50]}' on {self.Timestamp.strftime('%Y-%m-%d %H:%M')}"

class Follow(models.Model):
    UserFollowed = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "user_followed")
    FollowedByUser = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "followed_by_user")
    Timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_followed": self.UserFollowed,
            "followed_by_user": self.FollowedByUser,
            "timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"{self.FollowedByUser} is now following {self.UserFollowed}"

class Like(models.Model):
    PostLiked = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name = "post_liked")
    LikedByUser = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "liked_by_user")
    Timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "post_liked": self.PostLiked,
            "liked_by_user": self.LikedByUser,
            "timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"Post #{self.PostLiked.id} is liked by {self.LikedByUser}"

