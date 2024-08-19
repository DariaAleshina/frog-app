from django import forms
from django.core.validators import MaxLengthValidator, MinLengthValidator

from .models import User, Posts

class NewPostForm(forms.Form):
    PostText = forms.CharField(
        widget=forms.Textarea(attrs={'id': 'form_post_text','rows': 2}), 
        max_length = 140, 
        validators=[MinLengthValidator(0), MaxLengthValidator(140)]
    )