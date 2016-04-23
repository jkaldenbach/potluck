# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pots', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pot',
            name='state',
            field=models.CharField(default='deployed', max_length=20, choices=[(b'deployed', b'Deployed'), (b'lost', b'Lost'), (b'collected', b'Collected')]),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pot',
            name='size',
            field=models.CharField(max_length=20, choices=[(b'sm', b'small'), (b'lg', b'large')]),
        ),
    ]
