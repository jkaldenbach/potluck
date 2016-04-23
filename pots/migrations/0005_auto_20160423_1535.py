# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pots', '0004_auto_20160423_1153'),
    ]

    operations = [
        migrations.CreateModel(
            name='PotSet',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('color', models.CharField(max_length=6)),
            ],
        ),
        migrations.AlterField(
            model_name='location',
            name='pot',
            field=models.ForeignKey(related_name='pots', to='pots.Pot', null=True),
        ),
        migrations.AlterField(
            model_name='pot',
            name='name',
            field=models.CharField(max_length=50),
        ),
        migrations.AddField(
            model_name='location',
            name='pot_set',
            field=models.ForeignKey(related_name='locations', to='pots.PotSet', null=True),
        ),
        migrations.AddField(
            model_name='pot',
            name='pot_set',
            field=models.ForeignKey(related_name='pots', to='pots.PotSet', null=True),
        ),
    ]
