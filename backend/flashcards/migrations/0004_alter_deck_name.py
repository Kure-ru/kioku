# Generated by Django 5.1.1 on 2024-09-29 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0003_remove_card_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deck',
            name='name',
            field=models.CharField(max_length=45),
        ),
    ]
