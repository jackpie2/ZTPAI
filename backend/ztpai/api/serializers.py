from rest_framework import serializers
from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast, User
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.hashers import make_password


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
        fields = ['id', 'name', 'roast', 'origin',
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
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            password=make_password(validated_data['password'])
        )

        user.save()
        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()
