# Generated by Django 5.0.7 on 2024-10-16 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0008_alter_address_mobile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phones',
            name='img',
            field=models.ImageField(upload_to='upload/phones'),
        ),
    ]