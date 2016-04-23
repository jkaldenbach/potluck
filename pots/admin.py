from django.contrib import admin
from pots.models import Pot, Location, Deployment, Fisher

admin.site.register(Pot)
admin.site.register(Location)
admin.site.register(Deployment)
admin.site.register(Fisher)
