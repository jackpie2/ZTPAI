# Generated by Django 4.2.6 on 2023-10-14 10:17

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Flavor',
            fields=[
                ('name', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Origin',
            fields=[
                ('name', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Roast',
            fields=[
                ('name', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Species',
            fields=[
                ('name', models.TextField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Coffee',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('flavors', models.ManyToManyField(blank=True, to='api.flavor')),
                ('origin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.origin')),
                ('roast', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.roast')),
                ('species', models.ManyToManyField(blank=True, to='api.species')),
            ],
        ),
    ]
