from django import forms
from django.core.validators import MinValueValidator
from .models import Category

class CommentForm(forms.Form):
    comment = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), max_length=500)

class BidForm(forms.Form):
    bid = forms.IntegerField(validators=[MinValueValidator(0)])

class NewListingForm(forms.Form):
    title = forms.CharField(label='Title', max_length=200, required=True, widget=forms.TextInput(attrs={'autofocus': 'autofocus'}))
    description = forms.CharField(label='Description', max_length = 1000, widget=forms.Textarea(attrs={'rows': 3}), required=True )
    category = forms.ModelChoiceField(queryset=Category.objects.all(), required=True, label='Category')
    picture_url = forms.URLField(label='Picture (link)')
    price = forms.IntegerField(label='Initial Price ($)' ,validators=[MinValueValidator(0)], required=True)




