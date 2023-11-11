from rest_framework import serializers
from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast
from django.contrib.auth.models import User as AuthUser


class CoffeeSerializer(serializers.HyperlinkedModelSerializer):

    # make sure to display the name of the origin, not the id
    origin = serializers.PrimaryKeyRelatedField(
        queryset=Origin.objects.all(), many=False)

    roast = serializers.PrimaryKeyRelatedField(
        queryset=Roast.objects.all(), many=False)

    species = serializers.PrimaryKeyRelatedField(
        queryset=Species.objects.all(), many=True)

    flavors = serializers.PrimaryKeyRelatedField(
        queryset=Flavor.objects.all(), many=True)

    class Meta:
        model = Coffee
        fields = ['name', 'roast', 'origin',
                  'species', 'flavors', 'date_added']


class FlavorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Flavor
        fields = ['name']


class OriginSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Origin
        fields = ['name']


class SpeciesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Species
        fields = ['name']


class RoastSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Roast
        fields = ['name']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = ['email', 'password']

    def create(self, validated_data):
        user = AuthUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['email']
        )

        user.save()
        return user
