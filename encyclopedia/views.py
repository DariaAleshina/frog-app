from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse 
from django import forms

from . import util

from markdown2 import Markdown

import random

class NewEntryForm(forms.Form):
    title = forms.CharField(
        label = "Title", 
        required = True, 
        max_length = 100)
        

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def wiki(request, entry):
    entry_content = util.get_entry(entry)

    if not entry_content:
        error_message = "Page not found"
        return render(request, "encyclopedia/error.html", {
            "error_message": error_message
        })
    else:
        markdowner = Markdown()
        entry_content_conv = markdowner.convert(entry_content)
        return render(request, "encyclopedia/wiki.html", {
        "entry": entry.capitalize(),
        "entry_content_conv" : entry_content_conv
        })

def error(request):
    return render(request, "encyclopedia/error.html")

def search(request):
    if request.method == "POST":
        q = request.POST.get('q')
        if not q: 
            return render(request, "encyclopedia/search-results.html")
        else:
            #found the existing page - redirect to it
            ll = []
            ol = util.list_entries()
            for element in ol:
                ll.append(element.lower())
            if (q in ol) or (q in ll):
                return HttpResponseRedirect(reverse("wiki_entry", kwargs={"entry": q}))
            else: 
                #display search result list with matching substring (if any)
                pl = []
                for entry in ol:
                    if (q in entry) or (q in entry.lower()):
                        pl.append(entry)
                return render(request, "encyclopedia/search-results.html", {
                    "results": pl,
                    "q": q
                } )
    else:
        return render(request, "encyclopedia/search-results.html")


def new(request):
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]

            #check if entry already exists
            list_of_exixting_entries = util.list_entries()
            for existing_entry in list_of_exixting_entries:
                if (title == existing_entry)  or (title == existing_entry.lower()) :
                    error_message = "This entry already exists"
                    return render(request, "encyclopedia/error.html", {
                        "error_message": error_message
                    })

            #create new entry
            content = request.POST.get('w3review')
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("wiki_entry", kwargs={"entry": title}))

        else: 
            return render(request, "encyclopedia/new.html", {
                "form": form
            })

    if request.method == "GET":
        return render(request, "encyclopedia/new.html", {
                "form": NewEntryForm()
        })


def random_entry(request):
    list = util.list_entries()
    random_element = random.choice(list)
    return HttpResponseRedirect(reverse("wiki_entry", kwargs={"entry": random_element}))

def edit(request, entry):

    if request.method == "POST":
        undated_content = request.POST.get('w3review')
        if not undated_content:
            entry_content = util.get_entry(entry)
            return render(request, "encyclopedia/edit.html", {
            "entry": entry.capitalize(),
            "entry_content": entry_content
            })

        util.save_entry(entry, undated_content)
        return HttpResponseRedirect(reverse("wiki_entry", kwargs={"entry": entry}))


    if request.method == "GET":
        entry_content = util.get_entry(entry)
        return render(request, "encyclopedia/edit.html", {
            "entry": entry.capitalize(),
            "entry_content": entry_content
            })
    
