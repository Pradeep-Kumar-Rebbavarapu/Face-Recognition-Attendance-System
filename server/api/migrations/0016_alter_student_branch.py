# Generated by Django 4.2.4 on 2023-10-09 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_groupphoto_date_alter_groupphoto_datestamp_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='branch',
            field=models.CharField(blank=True, choices=[('EE', 'EE'), ('ME', 'ME'), ('CE', 'CE'), ('MEMS', 'MEMS'), ('CSE', 'CSE')], default=None, max_length=225, null=True),
        ),
    ]
