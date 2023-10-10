# Generated by Django 4.2.4 on 2023-10-09 05:20

import api.helpers
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_groupphoto_image_alter_student_branch'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groupphoto',
            name='date',
            field=models.DateField(blank=True, default=None, max_length=225, null=True),
        ),
        migrations.AlterField(
            model_name='groupphoto',
            name='datestamp',
            field=models.DateField(blank=True, default=api.helpers.getdate, max_length=225, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='branch',
            field=models.CharField(blank=True, choices=[('MEMS', 'MEMS'), ('CE', 'CE'), ('CSE', 'CSE'), ('ME', 'ME'), ('EE', 'EE')], default=None, max_length=225, null=True),
        ),
    ]
