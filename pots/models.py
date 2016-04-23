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
    name = models.CharField(max_length=50)
    size = models.CharField(
        max_length=20,
        choices=POT_SIZES
    )
    state = models.CharField(
        max_length=20,
        choices=POT_STATES
    )
    pot_set = models.ForeignKey('PotSet',
        null=True,
        related_name='pots',
    )

    def __str__(self):
        return self.name

class PotSet(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=6)

    def __str__(self):
        return self.name

class Location(models.Model):
    id = models.AutoField(primary_key=True)
    pot = models.ForeignKey('Pot',
        related_name='locations',
        null=True,
    )
    pot_set = models.ForeignKey('PotSet',
        related_name='locations',
        null=True,
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField()

    def __str__(self):
        return '%s - %s - %s' % (self.id, self.pot, self.timestamp)
