from django.http import HttpResponse
from rest_framework import permissions, viewsets

from flashcards.models import Card, Deck
from flashcards.serializers import CardSerializer, DeckSerializer


def index(request):
    return HttpResponse("This is the flashcard index.")

class CardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cards to be viewed or edited.
    """
    queryset = Card.objects.all().order_by('creation_date')
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeckViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows decks to be viewed or edited.
    """
    queryset = Deck.objects.all().order_by('name')
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]