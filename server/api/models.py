from django.db import models
from .helpers import *
from django.contrib.postgres.fields import ArrayField
from django.utils.html import mark_safe
import face_recognition
import numpy as np
import json
from django.dispatch import receiver
from django.db.models.signals import post_save



# Create your models here.
def upload_student_image(instance,filename):
    return f'student_images/{filename}'
def upload_group_photo(instance,filename):
    return f'group_photo/{filename}'
    


    
class Student(models.Model):
    course_choices = (
        ('BTECH','BTECH'),
        ('MTECH','MTECH'),
    )
    branch_choices = {
        ('CSE','CSE'),
        ('EE','EE'),
        ('ME','ME'),
        ('CE','CE'),
        ('MEMS','MEMS'),
        
    }
    image1 = models.ImageField(null=True,blank=True,default=None,upload_to=upload_student_image)
    image2 = models.ImageField(null=True,blank=True,default=None,upload_to=upload_student_image)
    image1_encodings = models.JSONField(null=True, blank=True)
    image2_encodings = models.JSONField(null=True, blank=True)
    roll_number = models.CharField(null=True,blank=True,default=None,max_length=225)
    name = models.CharField(max_length=225,blank=True,null=True,default=None)
    year = models.IntegerField(null = True,blank = True,default=None)
    course = models.CharField(null = True,blank = True,default = None,choices=course_choices,max_length=225)
    branch = models.CharField(null= True,blank = True,default = None,choices=branch_choices,max_length=225)

    @property
    def image1_preview(self):
        if self.image1:
            return mark_safe(
                f'<img src="{self.image1.url}" width="100" height="100" />'
            )
        return ""
    
    @property
    def image2_preview(self):
        if self.image2:
            return mark_safe(
                f'<img src="{self.image2.url}" width="100" height="100" />'
            )
        return ""
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the object

        if self.image1:
            image_path = self.image1.path
            encodings = self.compute_face_encodings(image_path)
            if encodings is not None:
                encodings_json = [enc.tolist() for enc in encodings]
                self.image1_encodings = json.dumps(encodings_json)

        if self.image2:
            image_path = self.image2.path
            encodings = self.compute_face_encodings(image_path)
            if encodings is not None:
                encodings_json = [enc.tolist() for enc in encodings]
                self.image2_encodings = json.dumps(encodings_json)

        super().save(update_fields=['image1_encodings', 'image2_encodings'])

    def compute_face_encodings(self, image_path):
        try:
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            return encodings
        except Exception as e:
            print(f"Error computing encodings for {image_path}: {e}")
            return []
    
class GroupPhoto(models.Model):
    image = models.ImageField(upload_to=upload_group_photo)
    datestamp = models.CharField(max_length=225,default=getdate,null=True,blank=True)
    timestamp = models.CharField(max_length=225,default=gettime,null=True,blank=True)
    total_number_of_students = models.IntegerField(default=0,null=True,blank=True)
    course = models.CharField(max_length=225,default=None,null=True,blank=True)
    date = models.CharField(max_length=225,default=None,null=True,blank=True)
    students_present = models.ManyToManyField(Student)
    @property
    def image_preview(self):
        if self.image:
            return mark_safe(
                f'<img src="{self.image.url}" width="100" height="100" />'
            )
        return ""





