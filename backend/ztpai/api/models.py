from django.db import models
import uuid

# Create your models here.


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


class User(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    email = models.TextField()
    password = models.TextField()
