from collections import defaultdict
from django.utils import timezone
from rest_framework import permissions, viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.db.models.functions import TruncDate
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
from datetime import timedelta
from .utils import StudySessionManager

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
            answer_type = serializer.validated_data.get('easiness')
            updated_card = serializer.update(card, serializer.validated_data)

            # Manage the study session queue
            session_manager = StudySessionManager(user_id=request.user.id)

            if answer_type == 'again':
                session_manager.reinsert_card(card.id)
            
            next_card_id = session_manager.get_next_card()
            if next_card_id:
                next_card = Card.objects.get(id=next_card_id)
                next_card_data = CardSerializer(next_card).data
            else:
                next_card_data = None

            response_data = {
                'updated_card': CardSerializer(updated_card).data,
                'next_card': next_card_data,
            }            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """
        Handle both single and bulk creation of cards.
        """
        if isinstance(request.data, list):
            cards = []
            for card_data in request.data:
                serializer = CardSerializer(data=card_data)
                if serializer.is_valid():
                    self.perform_create(serializer)
                    cards.append(serializer.data)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success': 'Cards created successfully'}, status=status.HTTP_201_CREATED)
        else: # Single card
            return super().create(request, *args, **kwargs) 

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
    
class StudyDaysHeatmapView(APIView):
    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_date = today - timedelta(days=30)

        reviews = (Card.objects.filter(deck__user=user, reviewed_date__date__gte=start_date)
                               .annotate(date=TruncDate('reviewed_date'))
                               .values('date')
                               .annotate(count=Count('id'))
                               .order_by('date')
                               )
        data = [{'date': review['date'], 'count': review['count']} for review in reviews]
        return Response(data)
    
class StatsView(APIView):
    """
    API endpoint to retrieve stats: daily reviews, card statuses, and running total.
    """
    def get(self, request):
        user = request.user
        today = timezone.now().date()
        start_date = today - timedelta(days=30)

        daily_reviews = (Card.objects.filter(deck__user=user, reviewed_date__gte=start_date)
                         .annotate(date=TruncDate('reviewed_date'))
                         .values('date')
                         .annotate(count=Count('id'))
                         .order_by('date'))

        daily_reviews_map = defaultdict(int)
        for entry in daily_reviews:
            daily_reviews_map[entry['date']] = entry['count']
        
        combined_data = []
        card_statuses_map = defaultdict(lambda: {'new': 0, 'young': 0, 'mature': 0})

        for day in range(30):
            current_date = today - timedelta(days=day)

            new_cards_count = Card.objects.filter(deck__user=user, reviewed_date__date=current_date, repetitions=0).count()
            young_cards_count = Card.objects.filter(deck__user=user, reviewed_date__date=current_date, repetitions__gt=0, repetitions__lt=5).count()
            mature_cards_count = Card.objects.filter(deck__user=user, reviewed_date__date=current_date, repetitions__gte=5).count()

            card_statuses_map[current_date]['new'] += new_cards_count
            card_statuses_map[current_date]['young'] += young_cards_count
            card_statuses_map[current_date]['mature'] += mature_cards_count

            review_count = daily_reviews_map.get(current_date, 0)

            combined_data.append({
                'date': current_date,
                'learning': review_count,
                'new': card_statuses_map[current_date]['new'],  
                'young': card_statuses_map[current_date]['young'],
                'mature': card_statuses_map[current_date]['mature'],
            })   

        combined_data = sorted(combined_data, key=lambda x: x['date'])
        return Response(combined_data)