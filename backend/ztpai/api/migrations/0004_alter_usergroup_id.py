# Generated by Django 4.2.7 on 2024-01-20 20:13

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_usergroup_added_at_remove_usergroup_group_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usergroup',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]