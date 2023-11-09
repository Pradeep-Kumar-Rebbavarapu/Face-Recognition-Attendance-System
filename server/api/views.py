
from .models import *
from .helpers import *
import os
from rest_framework.generics import *
from django.conf import settings
from rest_framework.views import *
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import *
import csv
from django.http import HttpResponse
import boto3
from .tasks import test_func
from django.http import JsonResponse
# Create your views here.
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db import transaction
BASE_DIR = settings.BASE_DIR
s3 = boto3.resource('s3')



class GroupPhotoAPI(APIView):
    def post(self,request):
        data = request.data
        print(data)
        channel_name = data['channel_name']
        file = request.FILES['file']
        course = data['course']
        date = data['date']
        print('file',file)
        photo = GroupPhoto.objects.create(
                image=file,
                datestamp=getdate(),
                timestamp=gettime(),
                total_number_of_students_identified=0,
                total_number_of_students_present_in_the_photo=0,
                date = date,
                course = course,
                status="In Process"
        )
        photo.save()
        channel_layer = get_channel_layer()
        print(channel_layer)
        print(channel_name)
        async_to_sync(channel_layer.send)(
            channel_name,
            {
                "type": "process",
                "data": {
                    "id": photo.id,
                    "file": photo.image.name
                }
            }
        )
        return Response({"message":"done"})
    
class ProcessImage(APIView):
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
            total_number_of_students_identified=0,
            total_number_of_students_present_in_the_photo=0,
            date=date,
            course=course,
            status="In Process"
        )
        photo.save()
        test_func.delay(photo.id)
        return Response('Done')
        
        
class test_func_view(APIView):
    def post(self,request):
        data = request.data
        id = data['id']
        test_func.apply_async(args=[id], countdown=3)
        return Response({'message':'done'})
    
class SaveGroupPhotoDetails(APIView):
    def post(self,request):
        data = request.data
        identified_people = data['identified_people']
        total_number_of_students_identified = data['total_number_of_students_identified']
        total_number_of_students_present_in_the_photo = data['total_number_of_students_present_in_the_photo']
        no_of_unidentified_people = data['no_of_unidentified_people']
        accuracy = data['accuracy']
        total_number_of_students = data['total_number_of_students']
        id = data['id']
        all_students = Student.objects.filter(roll_number__in=identified_people)
        photo = GroupPhoto.objects.get(id=id)
        photo.students_present.add(*all_students)
        photo.total_number_of_students_identified = total_number_of_students_identified
        photo.total_number_of_students_present_in_the_photo = total_number_of_students_present_in_the_photo
        photo.no_of_unidentified_people = no_of_unidentified_people
        photo.accuracy = accuracy
        photo.total_number_of_students = total_number_of_students
        photo.status = 'Done'
        photo.save()
        # data = request.data
        # add_sum = data['add_sum']
        return Response({'message':'Done'})
        

    
def send_photo_s3_bucket(photo1,photo2,roll_number1,roll_number2):
    object1 = s3.Object('iitistudents','index/'+ roll_number1)
    ret1 = object1.put(Body=photo1,Metadata={'FullName':roll_number1[0:11]})
    object2 = s3.Object('iitistudents','index/'+ roll_number2)
    ret2 = object2.put(Body=photo2,Metadata={'FullName':roll_number2[0:11]})
    return True

class UploadDetails(APIView):
    def post(self,request):
        try:
            data = request.data
            students_photo1 = request.FILES['photo1']
            students_photo2 = request.FILES['photo2']
            student_name = data['name']
            roll_number = data['roll_number']
            course = data['course']
            branch = data['branch']
            year = data['year']
            # save the photo in database before saving it to s3 bucket
            student = Student.objects.create(
                name = student_name,
                roll_number = roll_number,
                course = course,
                branch = branch,
                year = year,
                image1 = students_photo1,
                image2 = students_photo2
            )
            student.save()
            send_photo_s3_bucket(student.image1,student.image2,students_photo1.name,students_photo2.name)
            return Response('done',status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response('errpr',status=status.HTTP_400_BAD_REQUEST)
    









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
            print(i)
            if i.date not in arr:
                arr.append(i.date)
                dates.append({
                    "dates":i.date,
                    "total_students":i.total_number_of_students_identified,
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
                "total_students": serializer.data.get('total_number_of_students_identified', ''),
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
        test = sorted(test, key=lambda x: x['roll_number'])

        # Print the sorted list
        print(test)
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



class UploadStudents(APIView):
    def get(self,request):
        image_folder_path = os.path.join(BASE_DIR,'static/student_images')
        images = os.listdir(image_folder_path)
        images = [(i,i[0:11]) for i in images]
        for image in images:
            file = open(image_folder_path + "/" + image[0],'rb')
            object = s3.Object('iitistudents','index/'+ image[0])
            ret = object.put(Body=file,
                            Metadata={'FullName':image[1]}) 