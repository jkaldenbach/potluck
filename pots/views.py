from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Pot, Location, Deployment
from .serializers import PotSerializer, LocationSerializer, DeploymentSerializer

class PotViewSet(viewsets.ModelViewSet):
    queryset = Pot.objects.all()
    serializer_class = PotSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by('-timestamp')
    serializer_class = LocationSerializer

class DeploymentViewSet(viewsets.ModelViewSet):
    queryset = Deployment.objects.all()
    serializer_class = DeploymentSerializer

    @list_route()
    def lostPots(self, request):
        lost_pots = Deployement.objects.filter(state="lost")
        serializer = DeploymentSerializer(lost_pots, many=True)
        return Response(serializer.data)

    @list_route()
    def lostPublic(self, request):
        lost_pots = Deployement.objects.filter(state="lost", loss_public=True)
        serializer = DeploymentSerializer(lost_pots, many=True)
        return Response(serializer.data)
