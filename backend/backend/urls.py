from django.contrib import admin
from django.urls import include, path
from flashcards import views
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
router.register(r'cards', views.CardViewSet)
router.register(r'decks', views.DeckViewSet, basename='deck')
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/decks/<int:deck_id>/cards/', views.CardsByDeckView.as_view(), name='deck-cards'),
    path('api/cards/<int:pk>/answer/', views.CardViewSet.as_view({'post': 'answer_card'}), name='card-answer'),
    path('stats/study-days-heatmap/', views.StudyDaysHeatmapView.as_view(), name='study-days-heatmap'),
    path('stats/cards-stats/', views.StatsView.as_view(), name='cards-stats'),
]
