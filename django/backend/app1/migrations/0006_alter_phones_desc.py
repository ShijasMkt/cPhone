# Generated by Django 5.0.7 on 2024-09-05 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0005_phones_desc'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phones',
            name='desc',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
