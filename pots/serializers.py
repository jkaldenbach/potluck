from .models import Pot, Location
from rest_framework import serializers

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('longitude', 'latitude', 'timestamp', 'pot')


class PotSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)

    class Meta:
        model = Pot
        fields = ('name', 'color', 'size', 'state', 'locations')
