# Generated by Django 5.0.6 on 2024-08-07 11:37

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Posts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PostText', models.CharField(max_length=140, validators=[django.core.validators.MinLengthValidator(0), django.core.validators.MaxLengthValidator(140)])),
                ('Timestamp', models.DateTimeField(auto_now_add=True)),
                ('UserPosted', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_creator', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
