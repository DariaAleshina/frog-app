# Generated by Django 5.0.6 on 2024-08-28 13:49

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frogApp', '0003_set_card'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='addInfo',
            field=models.CharField(blank=True, max_length=150, validators=[django.core.validators.MinLengthValidator(0), django.core.validators.MaxLengthValidator(150)]),
        ),
        migrations.AlterField(
            model_name='card',
            name='example',
            field=models.CharField(blank=True, max_length=150, validators=[django.core.validators.MinLengthValidator(0), django.core.validators.MaxLengthValidator(150)]),
        ),
    ]
