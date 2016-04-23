# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import pots.models


class Migration(migrations.Migration):

    dependencies = [
        ('pots', '0006_auto_20160423_1625'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='pot_set',
        ),
        migrations.RemoveField(
            model_name='pot',
            name='pot_set',
        ),
        migrations.AddField(
            model_name='pot',
            name='count',
            field=models.IntegerField(default=1, validators=[pots.models.at_least_one]),
        ),
        migrations.DeleteModel(
            name='PotSet',
        ),
    ]
