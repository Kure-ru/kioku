from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta

class Deck(models.Model):
    name = models.CharField(max_length=45, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

# Source OpenSuperMemo: https://github.com/clockzhong/OpenSuperMemo/
class Card(models.Model):
    question = models.CharField(max_length=200, unique=True, blank=False)
    answer = models.CharField(max_length=200, blank=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    reviewed_date = models.DateTimeField(null=True, blank=True)
    next_review_date = models.DateTimeField(null=True, blank=True)
    easiness_factor = models.FloatField(default=2.5)
    interval = models.IntegerField(default=1)
    repetitions = models.IntegerField(default=0) 
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.question
    
    def answer_card(self, easiness):
        """
        Update card's review status based on the easiness score (0-3).
        Easiness factor and interval are adjusted accordingly.
        """

        easiness_value = self._get_easiness_value(easiness)
        if easiness_value is None:
            return

        if easiness_value == 0:
            self._reset_review_status()
        else:
            self.repetitions += 1
            self.update_interval(easiness_value)
            self.update_easiness_factor(easiness_value)
        
        self._set_next_review_date()
        self.reviewed_date = timezone.now()
        self.save()

    def _get_easiness_value(self, easiness):
        easiness_map = {
            'again': 0,
            'hard': 1,
            'good': 2,
            'easy': 3
        }
        return easiness_map.get(easiness)
    
    def _reset_review_status(self):
        self.repetitions = 0
        self.interval = 1
        self.easiness_factor = 2.5

    def update_interval(self, easiness_value):
        """
        Update the interval based on the current interval and easiness factor.
        """
        # Set shorter intervals for the 1st review
        if self.repetitions == 1:
            self.interval = 1 if easiness_value in [0, 1, 2] else 2
        elif self.interval == 1:
            self.interval = 6
        else:
            self.interval = int(self.interval * self.easiness_factor)
    
    def update_easiness_factor(self, easiness_value):
        """
        Update the easiness factor (EF) based on the quality of the answer.
        Easiness (easy, good, hard, again) affects EF. Minimum EF is 1.3.
        """
        quality_map = {0: -0.8, 1: -0.3, 2: 0, 3: 0.2}
        delta = quality_map.get(easiness_value, 0)
        self.easiness_factor = max(1.3, self.easiness_factor + delta)
    
    def _set_next_review_date(self):
        self.next_review_date = timezone.now() + timedelta(days=self.interval)

    @property # defines methods in a class that can be accessed like attributes 
    def needs_review(self):
        """
        Check if the card needs to be reviewed.
        """
        return not self.next_review_date or timezone.now() >= self.next_review_date

    @property
    def card_status(self):
        """
        Determine the status of the card: new, young, or mature.
        """
        if self.repetitions == 0:
            return "new"
        elif self.repetitions < 5:
            return "young"
        else:
            return "mature"

         