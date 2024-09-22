from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class DeckCreationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.url = reverse('deck-list')
        
        self._set_authentication_token(self.user)

    def _set_authentication_token(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_create_deck_authenticated(self):
        response = self.client.post(self.url, {'name': 'New Deck'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Deck')

    def test_create_deck_unauthenticated(self):
        self.client.credentials() 
        response = self.client.post(self.url, {'name': 'New Deck'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_deck_with_empty_name(self):
        response = self.client.post(self.url, {'name': ''}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
