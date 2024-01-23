from django.db import models
import uuid
import hashlib
from django.contrib.auth.models import User


class Coffee(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.TextField()
    roast = models.ForeignKey('Roast', on_delete=models.CASCADE)
    origin = models.ForeignKey('Origin', on_delete=models.CASCADE)
    species = models.ManyToManyField(
        'Species', blank=True)
    flavors = models.ManyToManyField(
        'Flavor', blank=True)
    date_added = models.DateTimeField(auto_now_add=True)


class Flavor(models.Model):
    name = models.TextField(primary_key=True)


class Origin(models.Model):
    name = models.TextField(primary_key=True)


class Roast(models.Model):
    name = models.TextField(primary_key=True)


class Species(models.Model):
    name = models.TextField(primary_key=True)


# class User(models.Model):
#     id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
#     email = models.TextField(unique=True)
#     password = models.TextField()


# class UserGroup(models.Model):
#     id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
#     user = models.ForeignKey('User', on_delete=models.CASCADE)
#     group = models.ForeignKey('Group', on_delete=models.CASCADE)
#     added_at = models.DateTimeField(auto_now_add=True)


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
