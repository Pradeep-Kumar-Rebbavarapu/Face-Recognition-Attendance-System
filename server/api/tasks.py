from .models import Student, GroupPhoto
from .mlmodel import Attendance
import os
from django.conf import settings
from time import sleep
from celery import shared_task
import json
import requests
from django.db import transaction

@shared_task(bind=True)
def test_func(self, id):
    try:
        
            photo = GroupPhoto.objects.get(id=id)
            group_photo_path = os.path.join(os.path.join(settings.BASE_DIR, 'media'), photo.image.name)
            attendance = Attendance(group_photo_path)
            identified_people = attendance.__identify__person__(group_photo_path)
            total_students = attendance.__get__total__people__()
            unidentified_people = attendance.__get__unidentified__people__()
            all_students = Student.objects.filter(roll_number__in=identified_people)
            photo.students_present.add(*all_students)
            photo.total_number_of_students_identified = len(identified_people)
            photo.total_number_of_students_present_in_the_photo = total_students
            photo.no_of_unidentified_people = unidentified_people
            photo.accuracy = attendance.__get__accuracy__()
            photo.total_number_of_students = len(identified_people) + attendance.unidentified_people
            photo.status = "Done"
            photo.save()
            return 'Done'
    except Exception as e:
        print(e)
        return 'Failed'
