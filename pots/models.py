from django.db import models

def at_least_one(value):
    return value >= 1

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
    count = models.IntegerField(default=1, validators=[at_least_one])
    size = models.CharField(
        max_length=20,
        choices=POT_SIZES
    )
    state = models.CharField(
        max_length=20,
        choices=POT_STATES
    )

    def __str__(self):
        return self.name

class Location(models.Model):
    id = models.AutoField(primary_key=True)
    pot = models.ForeignKey('Pot',
        related_name='locations',
        null=True,
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField()

    def __str__(self):
        return '%s - %s - %s' % (self.id, self.pot, self.timestamp)
