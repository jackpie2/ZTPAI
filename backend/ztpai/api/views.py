from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from ztpai.api.serializers import CoffeeSerializer, FlavorSerializer, OriginSerializer
from ztpai.api.serializers import SpeciesSerializer, RoastSerializer

# Create your views here.

from ztpai.api.models import Coffee, Flavor, Origin, Species, Roast


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
