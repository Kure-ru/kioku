from django.contrib import admin
from django.urls import include, path
from flashcards import views

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'cards', views.CardViewSet)
router.register(r'decks', views.DeckViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
