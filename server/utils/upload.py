import boto3
import os

s3 = boto3.resource('s3')

images = os.listdir('/server/static/student_images') 

# Get list of objects for indexing
images = [(i,i[0:11]) for i in images]

for image in images:
    file = open('./images/' + image[0],'rb')
    object = s3.Object('all-students-facerecog-iiti','index/'+ image[0])
    ret = object.put(Body=file,
                    Metadata={'FullName':image[1]})