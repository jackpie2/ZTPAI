# Generated by Django 4.2.7 on 2024-01-23 15:04

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_coffeerating_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coffeerating',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]