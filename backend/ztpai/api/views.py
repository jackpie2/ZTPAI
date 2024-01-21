from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from ztpai.api.serializers import CoffeeSerializer, FlavorSerializer, OriginSerializer, UserSerializer, CoffeeRatingSerializer
from ztpai.api.serializers import SpeciesSerializer, RoastSerializer, RegisterSerializer, SignInSerializer, RefreshSerializer, UserGroupSerializer, Group
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast, User, CoffeeRating, UserGroup
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ztpai.api.permissions import IsAdmin, HasToken


class CoffeeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Coffee.objects.all().order_by('-date_added')
    serializer_class = CoffeeSerializer


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


class SignUp(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    user_group_serializer_class = UserGroupSerializer

    def get_serializer(self):
        return self.serializer_class()

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            user_group_serializer = self.user_group_serializer_class(
                data={'user': obj.id, 'group': Group.objects.get(name='user').id})
            print(user_group_serializer)
            if user_group_serializer.is_valid():
                user_group_serializer.save()

            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JWTAuth(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SignInSerializer

    def get_serializer(self):
        return self.serializer_class()

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


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = User.objects.all().order_by('-email')
    serializer_class = UserSerializer


class CoffeeRatingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CoffeeRating.objects.all().order_by('-date_added')
    serializer_class = CoffeeRatingSerializer
    http_method_names = ['post', 'put']


class UserGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializer
    http_method_names = ['post', 'put']
