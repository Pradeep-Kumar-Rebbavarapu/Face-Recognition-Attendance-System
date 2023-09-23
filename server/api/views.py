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
from .tasks import process_student_encodings
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


def getAttendanceOfAll(filename):
        group_photo_path = os.path.join(os.path.join(settings.BASE_DIR, 'media'), f"group_photo/{filename}")
        group_photo = face_recognition.load_image_file(group_photo_path)
        group_face_locations = face_recognition.face_locations(group_photo)
        group_face_encodings = face_recognition.face_encodings(group_photo, group_face_locations)
        
        present_students = set()  # Use a set to avoid duplicates
        
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
                present_students.add(closest_student.roll_number)  # You can use a unique identifier for the student instead of 'name'

        # Create the response dictionary

        response = {
            'total_students': len(present_students),
            'students': list(present_students)
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
                course = course
        )
        photo.save()
        response = getAttendanceOfAll(file.name)
        photo.total_number_of_students = response['total_students']
        all_students = Student.objects.filter(roll_number__in=response['students'])
        print(all_students)
        photo.students_present.add(*all_students)
        photo.save()
        return JsonResponse(response)
        


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
    

class ProcessEncodings(APIView):
    def get(self, request):
        students = Student.objects.filter(
            image1__isnull=False,
            image2__isnull=False,
            image1_encodings__isnull=True,
            image2_encodings__isnull=True
        )

        for student in students:
            # Trigger the Celery task asynchronously
            process_student_encodings.delay(student.id)

        return Response('Processing encodings started.')







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
        

        
        
        