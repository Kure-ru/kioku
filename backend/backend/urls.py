from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("flashcards/", include("flashcards.urls")),
    path('admin/', admin.site.urls),
]
