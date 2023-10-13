from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from ztpai.api.serializers import CoffeeSerializer, FlavorSerializer, OriginSerializer, CoffeeFlavorSerializer

# Create your views here.

from ztpai.api.models import Coffee, Flavor, Origin, CoffeeFlavor


class CoffeeViewSet(viewsets.ModelViewSet):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer


class FlavorViewSet(viewsets.ModelViewSet):
    queryset = Flavor.objects.all()
    serializer_class = FlavorSerializer


class OriginViewSet(viewsets.ModelViewSet):
    queryset = Origin.objects.all()
    serializer_class = OriginSerializer


class CoffeeFlavorViewSet(viewsets.ModelViewSet):
    queryset = CoffeeFlavor.objects.all()
    serializer_class = CoffeeFlavorSerializer
