# tasks.py

from celery import shared_task
from .models import Student
import json
import face_recognition

@shared_task
def process_student_encodings(student_id):
    try:
        student = Student.objects.get(pk=student_id)
        print(f"Processing encodings for student with roll number {student.roll_number} (Celery)")
        
        encodings = compute_face_encodings(student.image1)
        if encodings is not None and len(encodings) != 0:
            encodings_json = [enc.tolist() for enc in encodings]
            Student.objects.filter(pk=student.pk).update(image1_encodings=json.dumps(encodings_json))
        
        encodings = compute_face_encodings(student.image2)
        if encodings is not None and len(encodings) != 0:
            encodings_json = [enc.tolist() for enc in encodings]
            Student.objects.filter(pk=student.pk).update(image2_encodings=json.dumps(encodings_json))
        
        print(f"Completed processing encodings for student with roll number {student.roll_number} (Celery)")
    except Exception as e:
        print(f"Error processing encodings for Student {student_id} (Celery): {e}")

def compute_face_encodings(image_field):
    if image_field:
        try:
            image_path = image_field.path
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            return encodings
        except Exception as e:
            print(f"Error computing encodings for {image_field}: {e}")
    return []
