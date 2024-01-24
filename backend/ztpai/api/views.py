from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from ztpai.api.serializers import CoffeeSerializer, FlavorSerializer, OriginSerializer, UserSerializer, CoffeeRatingSerializer
from ztpai.api.serializers import SpeciesSerializer, RoastSerializer, RegisterSerializer, SignInSerializer, RefreshSerializer, Group
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast, CoffeeRating
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from ztpai.api.permissions import IsAdmin, HasToken
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.plumbing import OpenApiParameter
from ztpai.api import serializers
from rest_framework import filters


class CoffeeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Coffee.objects.all().order_by('-date_added')
    serializer_class = CoffeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'origin__name', 'species__name', 'flavors__name']


class FlavorViewSet(viewsets.ModelViewSet):
    queryset = Flavor.objects.all()
    serializer_class = FlavorSerializer


class OriginViewSet(viewsets.ModelViewSet):
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class SpeciesViewSet(viewsets.ModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer


class RoastViewSet(viewsets.ModelViewSet):
    queryset = Roast.objects.all()
    serializer_class = RoastSerializer


@extend_schema(request=RegisterSerializer)
class SignUp(generics.CreateAPIView):

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    # user_group_serializer_class = UserGroupSerializer

    # def get_serializer(self):
    #     return self.serializer_class()

    # def get_serializer_class(self):
    #     return self.serializer_class

    # def post(self, request, format=None):
    #     serializer = self.serializer_class(data=request.data)
    #     if serializer.is_valid():
    #         obj = serializer.save()
    #         # user_group_serializer = self.user_group_serializer_class(
    #         #     data={'user': obj.id, 'group': Group.objects.get(name='user').id})
    #         # print(user_group_serializer)
    #         # if user_group_serializer.is_valid():
    #         #     user_group_serializer.save()

    #         return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(request=SignInSerializer)
class JWTAuth(APIView):
    # permission_classes = [permissions.AllowAny]
    serializer_class = SignInSerializer

    def get_serializer(self):
        return self.serializer_class()

    def get_serializer_class(self):
        return self.serializer_class

    def post(self, request, format=None):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email)
        if user.exists():
            user = user.first()
            if check_password(password, user.password):
                token = RefreshToken.for_user(user)

                return Response({
                    'token': str(token.access_token),
                    'refresh': str(token)
                })
            else:
                return Response({'error': 'Wrong password'}, status=status.HTTP_401_UNAUTHORIZED)


@extend_schema(request=RefreshSerializer)
class JWTRefresh(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RefreshSerializer

    def get_serializer(self):
        return self.serializer_class()

    def post(self, request, format=None):
        refresh = request.data['refresh']
        token = RefreshToken(refresh)
        return Response({
            'token': str(token.access_token),
            'refresh': str(token)
        })


class UsersView(generics.ListAPIView):
    # permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('-email')
    serializer_class = UserSerializer


class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        user = User.objects.get(email=request.user.email)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class CoffeeUserScore(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CoffeeRating.objects.all()
    serializer_class = CoffeeRatingSerializer

    def retrieve(self, request, *args, **kwargs):
        coffee_id = self.kwargs['coffee_id']
        user_id = request.user.id
        rating = CoffeeRating.objects.filter(
            coffee=coffee_id, user=user_id).first()
        if rating is None:
            return Response({'rating': 0, 'comment': ''})
        serializer = CoffeeRatingSerializer(rating)
        return Response({
            'rating': serializer.data['rating'],
            'comment': serializer.data['comment']
        })


class RateCoffee(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.RateCoffeeSerializer

    def post(self, request, *args, **kwargs):
        rating_data = request.data
        coffee_id = rating_data['coffee']
        user_id = request.user.id
        rating = CoffeeRating.objects.filter(
            coffee=coffee_id, user=user_id).first()
        rating_data['user'] = user_id
        rating_data['rating'] = max(0, min(5, rating_data['rating']))
        if rating is None:
            if rating_data['rating'] == 0:
                return Response({'message': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CoffeeRatingSerializer(data=rating_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating added successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if rating_data['rating'] == 0:
                rating.delete()
                return Response({'message': 'Rating deleted successfully'}, status=status.HTTP_201_CREATED)
            serializer = CoffeeRatingSerializer(rating, data=rating_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating updated successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllReviews(generics.ListAPIView):
    queryset = CoffeeRating.objects.all()
    serializer_class = CoffeeRatingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        coffee_id = self.kwargs['coffee_id']
        return CoffeeRating.objects.filter(coffee=coffee_id)
