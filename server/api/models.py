from django.db import models
from .helpers import *
from django.utils.html import mark_safe




# Create your models here.
def upload_student_image(instance,filename):
    return f'student_images/{filename}'
def upload_group_photo(instance,filename):
    return f'group_photo/normal/{filename}'
def upload_boxed_photo(instance,filename):
    return f'group_photo/boxed/{filename}'
    


    
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
    
class GroupPhoto(models.Model):
    status_choices = {
        ('In Process','In Process'),
        ('Done','Done'),
        ('Error','Error')
    }
    image = models.ImageField(upload_to=upload_group_photo)
    identified_image = models.ImageField(upload_to=upload_boxed_photo)
    datestamp = models.CharField(max_length=225,default=getdate,null=True,blank=True)
    timestamp = models.CharField(max_length=225,default=gettime,null=True,blank=True)
    total_number_of_students_identified = models.IntegerField(default=0,null=True,blank=True)
    total_number_of_students_present_in_the_photo = models.IntegerField(default=0,null=True,blank=True)
    course = models.CharField(max_length=225,default=None,null=True,blank=True)
    date = models.CharField(max_length=225,default=None,null=True,blank=True)
    students_present = models.ManyToManyField(Student)
    status = models.CharField(max_length=20,choices=status_choices,null=True,blank=True,default=None)
    no_of_unidentified_people = models.IntegerField(null=True,blank=True,default=None)
    accuracy = models.CharField(max_length=10,null=True,blank=True,default=None)
    @property
    def image_preview(self):
        if self.image:
            return mark_safe(
                f'<img src="{self.image.url}" width="100" height="100" />'
            )
        return ""





