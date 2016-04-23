from django.db import models

# Create your models here.

class Pot(models.Model):
    POT_SIZES=(
        ("sm", "Small"),
        ("lg", "Large"),
    )

    POT_STATES=(
        ("deployed", "Deployed"),
        ("lost", "Lost"),
        ("collected", "Collected"),
    )

    id = models.AutoField(primary_key=True)
    color = models.CharField(max_length=6)
    size = models.CharField(
        max_length=20,
        choices=POT_SIZES
    )
    state = models.CharField(
        max_length=20,
        choices=POT_STATES
    )

    def __str__(self):
        return str(self.id) + " " + self.color

class Location(models.Model):

    id = models.AutoField(primary_key=True)
    pot = models.ForeignKey('Pot', related_name='locations')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField()

    def __str__(self):
        return str(self.id)
