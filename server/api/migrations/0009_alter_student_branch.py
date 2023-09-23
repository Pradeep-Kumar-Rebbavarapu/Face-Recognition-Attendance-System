# Generated by Django 4.1.7 on 2023-09-22 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_student_branch'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='branch',
            field=models.CharField(blank=True, choices=[('CE', 'CE'), ('ME', 'ME'), ('MEMS', 'MEMS'), ('EE', 'EE'), ('CSE', 'CSE')], default=None, max_length=225, null=True),
        ),
    ]
