# Generated by Django 4.2.7 on 2024-01-20 20:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_rename_group_id_usergroup_group_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usergroup',
            name='group',
        ),
        migrations.RemoveField(
            model_name='usergroup',
            name='user',
        ),
    ]