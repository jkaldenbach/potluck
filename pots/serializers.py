from rest_framework import serializers
from .models import Pot, Location, Deployment

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('longitude', 'latitude', 'timestamp', 'pot')

class DeploymentSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    class Meta:
        model = Deployment
        fields = ('name', 'pot', 'count', 'loss_count', 'loss_public', 'state', 'locations')

class PotSerializer(serializers.ModelSerializer):
    deployements = DeploymentSerializer(many=True, read_only=True)
    class Meta:
        model = Pot
        fields = ('name', 'type', 'top', 'middle', 'bottom', 'base', 'contrast', 'placement', 'deployments')
