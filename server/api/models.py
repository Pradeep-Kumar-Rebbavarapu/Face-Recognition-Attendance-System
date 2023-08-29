from django.db import models
from .helpers import *
from django.contrib.postgres.fields import ArrayField

# Create your models here.
def upload(instance,filename):
    return f'{filename}'
def upload_user_image(instance,filename):
    if(filename[6:8]<=20):
        return f'user_images1/{filename}'
    elif(filename[6:8]<=40):
        return f'user_images2/{filename}'
    elif(filename[6:8]<=60):
        return f'user_images3/{filename}'
    else: 
        return f'user_images4/{filename}'
    

class GroupPhoto(models.Model):
    image = models.FileField(upload_to=upload)
    datestamp = models.CharField(max_length=225,default=getdate,null=True,blank=True)
    timestamp = models.CharField(max_length=225,default=gettime,null=True,blank=True)
    total_number_of_students = models.IntegerField(default=0,null=True,blank=True)
    
class Students(models.Model):
    image1 = models.ImageField(null=True,blank=True,default=None)
    image2 = models.ImageField(null=True,blank=True,default=None)
    roll_number = models.IntegerField(null=True,blank=True,default=None)
    name = models.CharField(max_length=225,blank=True,null=True,default=None)