from celery import shared_task
from django.conf import settings
import os
from .models import Student,GroupPhoto
from .mlmodel import Attendance

# docker run  --publish=6379:6379 redis
@shared_task(bind=True)
def test_func(self,filename,id):
        photo = GroupPhoto.objects.get(id=id)
        group_photo_path = os.path.join(os.path.join(settings.BASE_DIR, 'media'),photo.image.name)
        attendance = Attendance(group_photo_path)
        identified_people = attendance.__identify__person__(group_photo_path)
        print(identified_people)
        total_students = attendance.__get__total__people__()
        unidentified_people = attendance.__get__unidentified__people__()
        # i have an array of identified people now add them to the database , photo object have a many to many field with student
        all_students = Student.objects.filter(roll_number__in=identified_people)
        photo.students_present.add(*all_students)
        photo.total_number_of_students_identified = total_students
        photo.total_number_of_students_present_in_the_photo = len(identified_people)
        photo.no_of_unidentified_people = unidentified_people
        photo.accuracy = attendance.__get__accuracy__()
        photo.total_number_of_students = len(identified_people) + attendance.unidentified_people
        photo.status = 'Done'
        photo.save()
        return 'Done'



     