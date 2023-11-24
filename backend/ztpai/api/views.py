from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from ztpai.api.serializers import CoffeeSerializer, FlavorSerializer, OriginSerializer
from ztpai.api.serializers import SpeciesSerializer, RoastSerializer, RegisterSerializer, SignInSerializer, RefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast, User
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
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

    def get_serializer(self):
        return self.serializer_class()

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
