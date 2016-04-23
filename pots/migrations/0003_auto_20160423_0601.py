# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pots', '0002_auto_20160423_0550'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='pot',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='pot',
            name='size',
            field=models.CharField(max_length=20, choices=[(b'sm', b'Small'), (b'lg', b'Large')]),
        ),
    ]
