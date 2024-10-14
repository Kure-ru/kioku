from django.contrib.auth.models import User
from rest_framework import serializers

from flashcards.models import Card, Deck

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'question', 'answer', 'creation_date', 'reviewed_date', 'deck', 'needs_review', 'next_review_date']

class AnswerCardSerializer(serializers.Serializer):
    easiness = serializers.ChoiceField(choices=['easy', 'good', 'hard', 'again'])

    def update(self, instance, validated_data):
        easiness_rating = validated_data['easiness']
    
        instance.answer_card(easiness_rating)
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
    
class ReviewCountSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()

class CardStatusSerializer(serializers.Serializer):
    new = serializers.IntegerField()
    young = serializers.IntegerField()
    mature = serializers.IntegerField()

class ReviewDueSerializer(serializers.Serializer):
    date = serializers.DateField()
    due_count = serializers.IntegerField()