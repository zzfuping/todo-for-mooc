# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2019-03-23 04:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TodoTask',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_name', models.CharField(blank=True, default='', max_length=255)),
            ],
            options={
                'default_permissions': ('read', 'change', 'add', 'delete'),
            },
        ),
    ]