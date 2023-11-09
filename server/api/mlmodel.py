import cv2
import numpy as np
import matplotlib.pyplot as plt
import cv2
from retinaface import RetinaFace
from deepface import DeepFace
import boto3


class Attendance:
  def __init__(self,group_photo_path):
    self.group_photo_path = group_photo_path
    self.students_embeddings = []
    self.identified_people = []
    self.unidentified_people = 0
    self.rekognition = boto3.client('rekognition', region_name='us-east-1')
    self.dynamodb = boto3.client('dynamodb', region_name='us-east-1')
    self.model = DeepFace.build_model("Facenet")
  def __rekognize__(self,image):
    image_binary = cv2.imencode('.jpg', image)[1].tobytes()
    response = self.rekognition.search_faces_by_image(
            CollectionId='famouspersons',
            Image={'Bytes':image_binary}                                       
    )
    found = False
    for match in response['FaceMatches']:
        print (match['Face']['FaceId'],match['Face']['Confidence'])
            
        face = self.dynamodb.get_item(
            TableName='face_recognition',  
            Key={'RekognitionId': {'S': match['Face']['FaceId']}}
            )
        if 'Item' in face:
            self.identified_people.append(face['Item']['FullName']['S'][:-2])
            print ("Found Person: ",face['Item']['FullName']['S'])
            found = True
    if not found:
        self.unidentified_people = self.unidentified_people + 1
        print("Person cannot be recognized")
  def sharpen(self,image):
      sharpened = cv2.addWeighted(image, 2, cv2.GaussianBlur(image, (0, 0), 30), -1, 0)
      return sharpened
  def increase_brightness(self,image, value=30):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    v = cv2.add(v, value)
    v = np.clip(v, 0, 255)
    adjusted_hsv = cv2.merge((h, s, v))
    brightened_image = cv2.cvtColor(adjusted_hsv, cv2.COLOR_HSV2BGR)
    return brightened_image
  def __read__group__photo__(self):
    img = cv2.imread(self.group_photo_path)
    return img
  def __get__accuracy__(self):
      return len(self.identified_people)*100/(len(self.identified_people) + self.unidentified_people)
  def __identify__person__(self,path):
      img = self.__read__group__photo__()
      obj = RetinaFace.detect_faces(path)
      for key in obj.keys():
          identity = obj[key]
          x, y, w, h = identity['facial_area']
          x -= 10
          y -= 10
          h += 10
          w += 10
          try:
            detected_face = img[y:h, x:w]
            detected_face = self.increase_brightness(detected_face, value=40)
            detected_face = self.sharpen(detected_face)
            detected_face = cv2.resize(detected_face, (800, 800))
            self.__rekognize__(detected_face)
          except Exception as e:
            print(e)
            continue
      self.identified_people = list(set(self.identified_people))
      print(f'Total Student {len(self.identified_people) + self.unidentified_people}')
      print(f'Total Students Array {self.identified_people}')
      print(f'accuracy of identification {len(self.identified_people)*100/(len(self.identified_people) + self.unidentified_people)} %')
      print(f'Total Unidentified Students {self.unidentified_people}')
      return self.identified_people
  def __draw__boxes__around__image__(self):
    img = self.__read__group__photo__()
    obj = RetinaFace.detect_faces(self.group_photo_path)
    for key in obj.keys():
      identity = obj[key]
      x,y,w,h = identity['facial_area']
      x -= 10
      y -= 10
      h += 10
      w += 10
      cv2.rectangle(img,(x,y),(w,h),(0,255,0),2)
    plt.figure(figsize=(20,20))
    plt.imshow(img[:,:,::-1])
    plt.show()
  def __get__total__people__(self):
    return self.unidentified_people + len(self.identified_people)
  def __get__identified__people__(self):
    return self.identified_people
  def __get__unidentified__people__(self):
    return self.unidentified_people
  
  
  
  
  

    