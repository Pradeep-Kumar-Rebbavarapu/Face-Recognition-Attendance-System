import threading
from .models import *
import face_recognition
import numpy as np


class CreateStudentsThread(threading.Thread):
    def __init__(self,total,filename,present_students,photo):
        self.total = total
        self.filename = filename
        self.present_students = present_students
        self.photo = photo
        threading.Thread.__init__(self)
    def compute_face_encodings(self,image_field):
        if image_field:
            try:
                image_path = image_field.path
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)
                return encodings
            except Exception as e:
                print(f"Error computing encodings for {image_field}: {e}")
                return []
    def process_student_encodings(self,student):
                try:
                    print(f"Processing encodings for student with roll number {student.roll_number}")
                    encodings = self.compute_face_encodings(student.image1)
                    if encodings is not None and len(encodings) != 0:
                        encodings_json = [enc.tolist() for enc in encodings]
                        Student.objects.filter(pk=student.pk).update(image1_encodings=json.dumps(encodings_json))
                    encodings = self.compute_face_encodings(student.image2)
                    if encodings is not None and len(encodings) !=0:
                        encodings_json = [enc.tolist() for enc in encodings]
                        Student.objects.filter(pk=student.pk).update(image2_encodings=json.dumps(encodings_json))
                    print(f"Completed processing encodings for student with roll number {student.roll_number}")
                except Exception as e:
                    print(f"Error processing encodings for Student {student.roll_number}: {e}")
    def run(self):
        try:
            group_photo = face_recognition.load_image_file(self.filename)
            group_face_locations = face_recognition.face_locations(group_photo)
            group_face_encodings = face_recognition.face_encodings(group_photo, group_face_locations)

            for group_face_encoding in group_face_encodings:
                closest_student = None
                min_distance = 1

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
                    self.present_students.add(closest_student.roll_number)  # You can use a unique identifier for the student instead of 'name'
            self.photo.total_number_of_students = len(self.present_students)
            all_students = Student.objects.filter(roll_number__in=self.present_students)
            print(all_students)
            self.photo.students_present.add(*all_students)
            self.photo.save()

        except Exception as e:
                print(e)
        
       

    