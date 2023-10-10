from django.shortcuts import render,redirect
from .models import *
from .helpers import *
import os
import threading
import face_recognition
import numpy as np
from rest_framework.generics import *
from django.conf import settings
from rest_framework.views import *
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import *
import pandas as pd
from .tasks import test_func
from io import BytesIO
from django.http import FileResponse
import csv
from django.http import HttpResponse
# Create your views here.
BASE_DIR = settings.BASE_DIR


def getAttendanceOfAll(filename):
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

        response = {
            'total_students': len(present_students),
            'students': list(present_students)
        }

        return response


class GroupPhotoAPI(APIView):
    def post(self,request):
        data = request.data
        print(data)
        file = request.FILES['file']
        course = data['course']
        date = data['date']
        print('file',file)
        photo = GroupPhoto.objects.create(
                image=file,
                datestamp=getdate(),
                timestamp=gettime(),
                total_number_of_students=0,
                date = date,
                course = course,
                status="In Process"
        )
        photo.save()
        test_func.delay(file.name,photo.id)
        return Response({'message':'Done'})
        


class UploadDetails(APIView):
    def get(self,request):
        path = os.path.join(os.path.join(BASE_DIR,'static'),f'student_images')
        folder = os.listdir(path)

        new_folder = []
        for i in folder:
            new_folder.append(i[0:9])
        new_folder = list(set(new_folder))
        print(len(new_folder))
        for i in new_folder:
            student = Student.objects.create(
                roll_number = i,
                branch="CSE",
                year=2,
                course="BTECH"
            )
            student.save()
            

        return Response('done')
    









class getCourseAttendance(ListAPIView):
    serializer_class = GroupPhotoSerializer
    def get_queryset(self,**kwargs):
        pk = self.kwargs.get('pk')
        print('pk',pk)
        Group_Photos = GroupPhoto.objects.filter(course=pk)
        return Group_Photos
    

class GetCoursesByDate(APIView):
    def get(self,request,pk):
        Group_photos = GroupPhoto.objects.filter(course=pk)
        print(Group_photos)
        dates = []
        arr = []
        data = {
            "dates":"",
            "total_students":"",
            "course":""
        }
        for i in Group_photos:
            if i.date not in arr:
                arr.append(i.date)
                dates.append({
                    "dates":i.date,
                    "total_students":i.total_number_of_students,
                    "course":i.course
                })
        return JsonResponse({"data":dates},status = status.HTTP_200_OK)
    

class GetEachCourseByDate(APIView):
    serializer_class = GroupPhotoSerializer

    def get(self, request, course, date):
        queryset = GroupPhoto.objects.filter(course=course, date=date)
        student_set = set()

        for group_photo in queryset:
            student_set.update(group_photo.students_present.all())  # Assuming 'students' is a ManyToManyField
        student_list = list(student_set)
        # Serialize the GroupPhoto queryset
        serialized_group_photos = GroupPhotoSerializer(queryset, many=True,context={'request': request})

        # Serialize the list of students
        serialized_students = StudentSerializer(student_list, many=True)  # Assuming you have a StudentSerializer

        response_data = {
            'data': serialized_group_photos.data,
            'students': serialized_students.data,
        }

        return Response(response_data)
        

        
        
class GetEachPhotoDetails(APIView):
    def get(self, request, id):
        try:
            photo = GroupPhoto.objects.get(id=id)
            serializer = GroupPhotoSerializer(photo,context={'request': request})
            students_present = serializer.data.get('students_present', [])
            students_list = []

            for student_id in students_present:
                student = Student.objects.get(id=student_id)
                students_list.append({
                    "roll_number": student.roll_number,
                    "name": student.name,
                    "course": student.course,
                    "branch": student.branch,
                    "year": student.year,
                })

            response_data = {
                "image": serializer.data.get('image', ''),
                "students": students_list,
                "course_taken_on": serializer.data.get('date', ''),
                "total_students": serializer.data.get('total_number_of_students', ''),
                "date_of_validation": serializer.data.get('datestamp', ''),
                "time_of_validation": serializer.data.get('timestamp', ''),
                "course": serializer.data.get('course', ''),
            }

            return JsonResponse(response_data, status=status.HTTP_200_OK)

        except GroupPhoto.DoesNotExist:
            return Response('Photo Not Found', status=status.HTTP_404_NOT_FOUND)
        

class DownloadExcel(APIView):
    def post(self, request):
        data = request.data
        course = data['course']
        date = data['date']
        __all__photos__of__the__course__and__date__ = GroupPhoto.objects.filter(date=date).filter(course=course)
        __all__students__of__the__class__ = set()
        for photo in __all__photos__of__the__course__and__date__:
            students_present = photo.students_present.all()
            __all__students__of__the__class__.update(students_present)
        test = []
        for i in __all__students__of__the__class__:
            test.append({
                "student_id": i.id,
                "roll_number": i.roll_number,
                "name": i.name,
                "course": i.course,
                "branch": i.branch,
                "year": i.year,
            })

        # Create a response object with the appropriate content type for CSV
        response = HttpResponse(content_type='text/csv')
        file_name = f"{course}__{date}.csv"

        # Set the Content-Disposition header to suggest the filename for download
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'

        # Create a CSV writer using the response as the output file
        csv_writer = csv.writer(response)

        # Write the header row
        header_row = ["Student ID", "Roll Number", "Name", "Course", "Branch", "Year"]
        csv_writer.writerow(header_row)

        # Write data rows
        for row in test:
            data_row = [row["student_id"], row["roll_number"], row["name"], row["course"], row["branch"], row["year"]]
            csv_writer.writerow(data_row)

        return response



