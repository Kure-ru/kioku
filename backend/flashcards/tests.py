from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from flashcards.models import Card, Deck
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

class CardCreationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.deck = Deck.objects.create(name='Test Deck')

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.url = reverse('card-list')

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_card_authenticated(self):
        self.authenticate()

        data = {
            'question': 'What is Python?',
            'answer': 'A programming language',
            'deck': self.deck.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Card.objects.count(), 1)
        self.assertEqual(Card.objects.get().question, 'What is Python?')

    def test_create_card_unauthenticated(self):
        data = {
            'question': 'What is Python?',
            'answer': 'A programming language',
            'deck': self.deck.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Card.objects.count(), 0)

    def test_create_card_missing_fields(self):
        self.authenticate()

        data = {
            'question': 'What is Python?',
            'deck': self.deck.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('answer', response.data)

    def test_create_card_invalid_deck(self):
        self.authenticate()

        data = {
            'question': 'What is Python?',
            'answer': 'A programming language',
            'deck': 999  # Invalid deck ID
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('deck', response.data)

    def test_create_card_empty_fields(self):
        """Test that card creation fails when question or answer is empty."""
        self.authenticate()

        data = {
            'question': '',
            'answer': 'A programming language',
            'deck': self.deck.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('question', response.data)

        data = {
            'question': 'What is Python?',
            'answer': '',
            'deck': self.deck.id
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('answer', response.data)
