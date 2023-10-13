from django.db import models

# Create your models here.


class Coffee(models.Model):
    name = models.TextField()
    roast = models.TextField()
    origin = models.ForeignKey('Origin', on_delete=models.CASCADE)
    species = models.TextField(null=True)
    date_added = models.DateTimeField(auto_now_add=True)


class Flavor(models.Model):
    name = models.TextField(primary_key=True)


class Origin(models.Model):
    name = models.TextField(primary_key=True)


class CoffeeFlavor(models.Model):
    coffee = models.ForeignKey(Coffee, on_delete=models.CASCADE)
    flavor = models.ForeignKey(Flavor, on_delete=models.CASCADE)
