
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("posts/<str:filter_url>", views.post_page, name="post_page"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("new", views.create_new_post, name="create_new_post"),
    path("view/", views.posts_view, name="posts_view"),
    path("follow", views.follow_submit, name="follow"),
    path("edit", views.edit, name="edit"),
    path("likecheck/", views.display_like_icon, name = "display_like_icon"),
    path("like", views.like, name = "like")
]
