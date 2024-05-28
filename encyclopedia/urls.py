from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:entry>", views.wiki, name="wiki_entry"),
    path("error", views.error, name="error"),
    path("search-results", views.search, name="search"),
    path("new", views.new, name="new"),
    path("random", views.random_entry, name="random"),
    path("edit/<str:entry>", views.edit, name="edit")
]
