from django.db import models
from django.utils import timezone

class Deck(models.Model):
    name = models.CharField(max_length=45, unique=True, blank=False)
    def __str__(self):
        return self.name

class Card(models.Model):
    question = models.CharField(max_length=200, unique=True, blank=False)
    answer = models.CharField(max_length=200, blank=False)
    creation_date = models.DateTimeField(auto_created=True)
    reviewed_date = models.DateTimeField(null=True, blank=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    def __str__(self):
        return self.question
    def has_been_reviewed(self):
        self.reviewed_date = timezone.now()
        self.save()
