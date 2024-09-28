from django.contrib.auth.models import User
from rest_framework import serializers

from flashcards.models import Card, Deck

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'answer', 'creation_date', 'reviewed_date', 'deck', 'needs_review']

class AnswerCardSerializer(serializers.Serializer):
    easiness = serializers.ChoiceField(choices=['easy', 'good', 'hard', 'again'])

    def update(self, instance, validated_data):
        easiness_rating = validated_data['easiness']
    
        rating_map = {
            'easy': 3,
            'good': 2,
            'hard': 1,
            'again': 0
        }

        easiness_value = rating_map[easiness_rating]
        instance.answer_card(easiness_value)
        instance.save()
        return instance

class DeckSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Deck
        fields = ['id', 'name', 'user']
    
    def create(self, validated_data):
        return Deck.objects.create(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user