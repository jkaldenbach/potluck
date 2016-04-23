from rest_framework import serializers
from .models import Pot, Location, Deployment

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('longitude', 'latitude', 'timestamp', 'pot', 'id')

class PotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pot
        fields = ('id', 'name', 'type', 'top', 'middle', 'bottom', 'base', 'contrast', 'placement')

class DeploymentSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    pot = PotSerializer(many=False, read_only=True)
    class Meta:
        model = Deployment
        fields = ('name', 'count', 'loss_count', 'loss_public', 'state', 'locations', 'pot', 'id')
