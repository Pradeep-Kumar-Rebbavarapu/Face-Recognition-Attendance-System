from celery import shared_task
import face_recognition
import numpy as np
from django.conf import settings
import os
from .models import Student,GroupPhoto
import json
@shared_task(bind=True)
def test_func(self,filename,id):
        group_photo_path = os.path.join(os.path.join(settings.BASE_DIR, 'media'), f"group_photo/{filename}")
        group_photo = face_recognition.load_image_file(group_photo_path)
        group_face_locations = face_recognition.face_locations(group_photo)
        group_face_encodings = face_recognition.face_encodings(group_photo, group_face_locations)
        
        present_students = set()  # Use a set to avoid duplicates
        
        for group_face_encoding in group_face_encodings:
            closest_student = None
            min_distance = 0.6
            
            for student in Student.objects.all():
                encodings = []
                if student.image1_encodings:
                    encodings += json.loads(student.image1_encodings)
                if student.image2_encodings:
                    encodings += json.loads(student.image2_encodings)
                
                if encodings:
                    distances = face_recognition.face_distance(np.array(encodings), group_face_encoding)
                    min_distance_index = np.argmin(distances)
                    
                    if distances[min_distance_index] < min_distance:
                        closest_student = student
                        min_distance = distances[min_distance_index]
            
            if closest_student:
                present_students.add(closest_student.roll_number)  # You can use a unique identifier for the student instead of 'name'

        # Create the response dictionary
        photo = GroupPhoto.objects.get(id=id)
        photo.total_number_of_students = len(present_students)
        all_students = Student.objects.filter(roll_number__in=list(present_students))
        print(all_students)
        photo.students_present.add(*all_students)
        photo.save()
        return 'Done'