# Generated by Django 4.2.7 on 2024-01-23 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_remove_usergroup_group_remove_usergroup_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='coffeerating',
            name='comment',
            field=models.TextField(blank=True),
        ),
    ]