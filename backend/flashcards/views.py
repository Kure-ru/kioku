from django.utils import timezone
from rest_framework import permissions, viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q 
from flashcards.models import Card, Deck
from flashcards.serializers import (
    AnswerCardSerializer,
    CardSerializer,
    DeckSerializer,
    RegisterSerializer,
    UserSerializer
)
from rest_framework.response import Response
from rest_framework.decorators import action


class CardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cards to be viewed or edited.
    """
    queryset = Card.objects.all().order_by('creation_date')
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='answer')
    def answer_card(self, request, pk=None):
        """
        API endpoint to submit an answer for a specific card.
        """
        card = self.get_object()
        serializer = AnswerCardSerializer(data=request.data)

        if serializer.is_valid():
            updated_card = serializer.update(card, serializer.validated_data)
            return Response(CardSerializer(updated_card).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CardsByDeckView(generics.ListAPIView):
    """
    API endpoint that allows retrieving all cards for a specific deck.
    """
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        deck_id = self.kwargs['deck_id']
        queryset = Card.objects.filter(deck_id=deck_id)

        needs_review = self.request.query_params.get('review', None)
        if needs_review and needs_review.lower() == 'true':
            queryset = queryset.filter(
                Q(next_review_date__lte=timezone.now()) |
                Q(next_review_date__isnull=True)
            )
        return queryset

class DeckViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows decks to be viewed or edited.
    """
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deck.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RegisterView(APIView):
    """
    API endpoint for user registration.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
       serializer = RegisterSerializer(data=request.data)
       serializer.is_valid(raise_exception=True)
       user = serializer.save()
       return Response({
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_201_CREATED)