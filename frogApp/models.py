from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.db.models import Count


# Create your models here.

class User(AbstractUser):
    pass

class Set(models.Model):
    name = models.CharField(max_length = 50, validators=[MinLengthValidator(0), MaxLengthValidator(50)])
    userCreated = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "set_creator")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "setName": self.name,
            "setCreator": self.userCreated.username,
            "setCreatorId": self.userCreated.id,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "card_count": self.card_count,
            "is_starred": self.is_starred,
            "star_count": self.star_count
        }

    def __str__(self):
        return f"{self.id}: {self.name} // by {self.userCreated.username}"

class Card(models.Model):
    word = models.CharField(max_length = 150, validators=[MinLengthValidator(0), MaxLengthValidator(150)])
    translation = models.CharField(max_length = 150, validators=[MinLengthValidator(0), MaxLengthValidator(150)])
    example = models.CharField(max_length = 150, validators=[MinLengthValidator(0), MaxLengthValidator(150)], blank=True)
    addInfo = models.CharField(max_length = 150, validators=[MinLengthValidator(0), MaxLengthValidator(150)], blank=True)
    fromSet = models.ForeignKey(Set, on_delete=models.CASCADE, related_name = "card_from_set")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "word": self.word,
            "translation": self.translation,
            "example": self.example,
            "addInfo": self.addInfo,
            "fromSetId": self.fromSet.id,
            "userCreatedId": self.fromSet.userCreated.id,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"{self.word[:20]} added to set '{self.fromSet.name}'"

class StarSet(models.Model):
    setStarred = models.ForeignKey(Set, on_delete=models.CASCADE, related_name = "set_starred")
    addedByUser = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "added_by_user")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "set_starred": self.setStarred,
            "added_by_user": self.addedByUser,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

    def __str__(self):
        return f"Set {self.setStarred.name} (#{self.setStarred.id}) is added to {self.addedByUser}'studyroom"



