from django.db import models

# Create your models here.

class Pot(models.Model):
    color = models.CharField(max_length=6)
    size = models.CharField()

class Location(models.Model):
    pot = models.ForeignKey('Pot')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField()
