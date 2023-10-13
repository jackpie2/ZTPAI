from rest_framework import serializers
from ztpai.api.models import Coffee, Flavor, Origin, CoffeeFlavor


class CoffeeSerializer(serializers.HyperlinkedModelSerializer):

    # make sure to display the name of the origin, not the id
    origin = serializers.PrimaryKeyRelatedField(
        queryset=Origin.objects.all(), many=False)

    class Meta:
        model = Coffee
        fields = ['name', 'roast', 'origin', 'species', 'date_added']


class FlavorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Flavor
        fields = ['name']


class OriginSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Origin
        fields = ['name']


class CoffeeFlavorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CoffeeFlavor
        fields = ['coffee', 'flavor']
