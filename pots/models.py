from django.db import models

def at_least_one(value):
    return value >= 1

class Deployment(models.Model):
    POT_STATES=(
        ("deployed", "Deployed"),
        ("lost", "Lost"),
        ("collected", "Collected"),
    )

    id = models.AutoField(primary_key=True)
    pot = models.ForeignKey('Pot',
        related_name="deployments",
        null=True
    )
    name = models.CharField(max_length=50)
    count = models.IntegerField(default=1, validators=[at_least_one])
    loss_count = models.IntegerField(blank=True, null=True, validators=[at_least_one])
    loss_public = models.BooleanField(default=False)
    state = models.CharField(
        max_length=20,
        choices=POT_STATES
    )

    def __str__(self):
        return '%s - %s' % (self.name, self.pot)

class Pot(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="pot")
    type = models.CharField(max_length=50, default="Lobster")

    # buoy
    top = models.CharField(max_length=50, blank=True)
    middle = models.CharField(max_length=50, blank=True)
    bottom = models.CharField(max_length=50, blank=True)

    # line
    base = models.CharField(max_length=50, blank=True)
    contrast = models.CharField(max_length=50, blank=True)
    placement = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name + " " + self.type

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
        return '%s - %s - %s' % (self.id, self.deployment, self.timestamp)

class Fisher(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="Ishmael")
    password = models.CharField(max_length=50, default="********")
    license = models.CharField(max_length=50, blank=True, null=True)
    image_url = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return '%s %s' % (self.name, self.license);
