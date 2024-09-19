from django.contrib.auth.models import User
from rest_framework import serializers

from flashcards.models import Card, Deck

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'answer', 'creation_date', 'reviewed_date', 'deck', 'score']

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id', 'name']