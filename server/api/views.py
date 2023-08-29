from django.shortcuts import render,redirect
from .models import *
from .helpers import *
import os
import face_recognition
import numpy as np
from django.conf import settings
from rest_framework.views import *
from rest_framework.response import Response
from django.http import JsonResponse
# Create your views here.
BASE_DIR = settings.BASE_DIR
def getAttendance(filename,level):
    student_images_dir = os.path.join(os.path.join(BASE_DIR,'static'),f'user_images{level}')
    student_images = os.listdir(student_images_dir)
    encodings = []
    print(student_images)
    for student_image_file in student_images:
        student_image_path = os.path.join(student_images_dir, student_image_file)
        student_image = face_recognition.load_image_file(student_image_path)
        student_encodings = face_recognition.face_encodings(student_image)
        if student_encodings:  # Check if any face encodings were found
            encoding = student_encodings[0]
        else:
            print(f"No face encodings found for {student_image_path}")
            continue
        encodings.append(encoding)
    group_photo_path = os.path.join(os.path.join(BASE_DIR,'media'),filename)
    group_photo = face_recognition.load_image_file(group_photo_path)
    group_face_locations = face_recognition.face_locations(group_photo)
    group_face_encodings = face_recognition.face_encodings(group_photo, group_face_locations)
    min_distance = 1  
    present_students = []

    for group_face_encoding in group_face_encodings:
        distances = face_recognition.face_distance(encodings, group_face_encoding)
        min_distance_index = np.argmin(distances)

        if distances[min_distance_index] < min_distance:
            present_students.append(student_images[min_distance_index])

    # Print the list of present students
    response = {
        'total_students':len(list(set(present_students))),
        'students':list(set(present_students))
    }
    return response

def GroupPhotoData(request):
        if request.method == "POST":
            files = request.FILES.get('files')
            print(files)
            photo = GroupPhoto.objects.create(
                image=files,
                datestamp=getdate(),
                timestamp=gettime(),
                total_number_of_students=0,
            )
            photo.save()
            response1 = getAttendance(files.name,1)
            response2 = getAttendance(files.name,2)
            response3 = getAttendance(files.name,3)
            response4 = getAttendance(files.name,4)
            total_students = response1['total_students'] + response2['total_students'] + response3['total_students'] + response4['total_students'] 
            all_students = response1['students'] + response2['students'] + response3['students'] + response4['students']
            return render(request,'attendance.html',{'total_students':total_students,'students':all_students})
        else:
            return render(request,'index.html',{})




class GroupPhotoAPI(APIView):
    def post(self,request):
        
        data = request.data
        file = request.FILES['file']
        photo = GroupPhoto.objects.create(
                image=file,
                datestamp=getdate(),
                timestamp=gettime(),
                total_number_of_students=0,
        )
        photo.save()
        print('file',file)
        id = data['id']
        print('id',id)
        response = getAttendance(file.name,id)
        return JsonResponse(response)
        
