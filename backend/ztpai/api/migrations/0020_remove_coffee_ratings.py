# Generated by Django 4.2.7 on 2024-01-23 13:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_coffeerating_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coffee',
            name='ratings',
        ),
    ]
