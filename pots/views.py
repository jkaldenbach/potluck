from .models import Pot, Location, PotSet
from rest_framework import viewsets
from .serializers import PotSerializer, LocationSerializer, PotSetSerializer

class PotViewSet(viewsets.ModelViewSet):
    queryset = Pot.objects.all()
    serializer_class = PotSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by('-timestamp')
    serializer_class = LocationSerializer

class PotSetViewSet(viewsets.ModelViewSet):
    queryset = PotSet.objects.all()
    serializer_class = PotSetSerializer
