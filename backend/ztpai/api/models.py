from django.db import models
import uuid
from django.contrib.auth.models import User


class Coffee(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.TextField(
        unique=True
    )
    roast = models.ForeignKey('Roast', on_delete=models.CASCADE)
    origin = models.ForeignKey('Origin', on_delete=models.CASCADE)
    species = models.ManyToManyField(
        'Species', blank=True)
    flavors = models.ManyToManyField(
        'Flavor', blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    image = models.ForeignKey(
        'CoffeeImage', on_delete=models.CASCADE, blank=True, null=True)


class Flavor(models.Model):
    name = models.TextField(primary_key=True)


class Origin(models.Model):
    name = models.TextField(primary_key=True)


class Roast(models.Model):
    name = models.TextField(primary_key=True)


class Species(models.Model):
    name = models.TextField(primary_key=True)


class Group(models.Model):
    name = models.TextField(primary_key=True)


class CoffeeRating(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    coffee = models.ForeignKey(
        'Coffee', on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['coffee', 'user']


class CoffeeImage(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    image = models.ImageField(upload_to='', blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['image']
