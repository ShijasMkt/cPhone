# Generated by Django 5.0.7 on 2024-09-05 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0004_rename_total_cart_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='phones',
            name='desc',
            field=models.CharField(default='shijas', max_length=100),
            preserve_default=False,
        ),
    ]
