# Generated by Django 5.0.7 on 2024-11-18 10:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0013_orders'),
    ]

    operations = [
        migrations.AddField(
            model_name='orders',
            name='address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app1.address'),
        ),
    ]