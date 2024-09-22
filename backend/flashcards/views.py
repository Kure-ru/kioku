from rest_framework import permissions, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from flashcards.models import Card, Deck
from flashcards.serializers import CardSerializer, DeckSerializer, RegisterSerializer, UserSerializer
from rest_framework.response import Response


class CardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows cards to be viewed or edited.
    """
    queryset = Card.objects.all().order_by('creation_date')
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

class DeckViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows decks to be viewed or edited.
    """
    queryset = Deck.objects.all().order_by('name')
    serializer_class = DeckSerializer
    permission_classes = [IsAuthenticated]

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

