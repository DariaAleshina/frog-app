from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("create", views.create_view, name="create"),
    path("set/<int:set_id>", views.set_view, name="set_view"),
    path("studyroom", views.studyroom, name="studyroom"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<int:user_id>", views.profile, name="profile"),

    # API Routes
    path("create_new_set", views.create_new_set, name="create_new_set"),
    path("create_new_card", views.create_new_card, name="create_new_card"),
    path("load_cards/", views.load_cards, name="load_cards"),
    path("load_sets/", views.load_sets, name="load_sets"),
    path("star_set", views.star_set, name="star_set"),
    path("delete_card", views.delete_card, name="delete_card"),
    path("edit_card", views.edit_card, name="edit_card")
]
