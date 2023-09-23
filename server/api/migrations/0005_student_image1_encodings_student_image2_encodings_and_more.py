# Generated by Django 4.1.7 on 2023-09-22 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_student_branch'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='image1_encodings',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='student',
            name='image2_encodings',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='branch',
            field=models.CharField(blank=True, choices=[('EE', 'EE'), ('MEMS', 'MEMS'), ('ME', 'ME'), ('CE', 'CE'), ('CSE', 'CSE')], default=None, max_length=225, null=True),
        ),
    ]