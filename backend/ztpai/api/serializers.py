from rest_framework import serializers
from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast, CoffeeRating, Group, CoffeeImage
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db.models import Avg


class CoffeeSerializer(serializers.ModelSerializer):
    origin = serializers.PrimaryKeyRelatedField(
        queryset=Origin.objects.all(), many=False)

    roast = serializers.PrimaryKeyRelatedField(
        queryset=Roast.objects.all(), many=False)

    species = serializers.PrimaryKeyRelatedField(
        queryset=Species.objects.all(), many=True)

    flavors = serializers.PrimaryKeyRelatedField(
        queryset=Flavor.objects.all(), many=True)

    score = serializers.SerializerMethodField()

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Coffee
        fields = ['id', 'name', 'roast', 'origin',
                  'species', 'flavors', 'date_added', 'score', 'description', 'image_url']

    def get_score(self, obj):
        ratings = CoffeeRating.objects.filter(coffee=obj)
        return ratings.aggregate(Avg('rating'))['rating__avg'] or 0

    def get_image_url(self, obj):
        return str(obj.image.image) if obj.image else None


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
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
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


class CoffeeRatingSerializer(serializers.ModelSerializer):
    coffee_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = CoffeeRating
        fields = ['coffee', 'user', 'rating',
                  'date_added', 'coffee_name', 'comment', 'user_name']

    def get_coffee_name(self, obj):
        return obj.coffee.name

    def get_user_name(self, obj):
        return obj.user.username


class RateCoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoffeeRating
        fields = ['coffee', 'rating', 'comment']


class UserSerializer(serializers.ModelSerializer):
    user_ratings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'user_ratings')

    def get_user_ratings(self, obj):
        ratings = CoffeeRating.objects.filter(
            user=obj)
        return CoffeeRatingSerializer(ratings, many=True).data


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name']


class CoffeeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoffeeImage
        fields = ['image', 'id']


# class UserGroupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserGroup
#         fields = ['user', 'group']

#     def create(self, validated_data):
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         return super().update(instance, validated_data)

#     def validate(self, data):
#         return super().validate(data)
