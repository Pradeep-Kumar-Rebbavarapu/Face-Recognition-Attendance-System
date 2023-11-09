from rest_framework import serializers
from .models import *
from django.db import transaction
from .tasks import test_func

class GroupPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupPhoto
        fields = "__all__"
    

        
   

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("roll_number","name","branch","course","year")