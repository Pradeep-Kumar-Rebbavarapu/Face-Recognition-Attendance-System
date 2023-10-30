# myapp/consumers.py

import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from django.conf import settings
from .models import GroupPhoto,Student
import json
import os
from .mlmodel import Attendance


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print(self.channel_name)
        self.room_name = 'test_consumer'
        self.room_group_name = '1234'
        await self.accept()
        

    async def disconnect(self, close_code):
        await self.leave_room()

    async def receive_json(self, text_data):

        data = text_data['data']
        if text_data['type'] == 'process':
            await self.process(data)


    @database_sync_to_async
    def __save__response__(self, response):
        id = response['id']
        photo = GroupPhoto.objects.get(id=id)
        all_students = Student.objects.filter(roll_number__in=response['identified_people'])
        photo.students_present.set(*all_students)
        photo.total_number_of_students_identified = response['total_number_of_students_identified']
        photo.total_number_of_students_present_in_the_photo = response['total_number_of_students_identified']
        photo.no_of_unidentified_people = response['no_of_unidentified_people']
        photo.accuracy = response['accuracy']
        photo.total_number_of_students = response['total_number_of_students']
        photo.save()

    
    async def process(self, data):
        print('data',data)
        id = data['data']['id']
        file = data['data']['file']
        group_photo_path = os.path.join(os.path.join(settings.BASE_DIR, 'media'),file)
        attendance = Attendance(group_photo_path)
        identified_people = attendance.__identify__person__(group_photo_path)
        total_students = attendance.__get__total__people__()
        unidentified_people = attendance.__get__unidentified__people__()
        # Fetch students and update the photo object
        response = {
            "id":id,
            "identified_people":identified_people,
            "total_number_of_students_identified":len(identified_people),
            "total_number_of_students_present_in_the_photo":total_students,
            "no_of_unidentified_people":unidentified_people,
            "accuracy":attendance.__get__accuracy__(),
            "total_number_of_students":len(identified_people) + attendance.unidentified_people
        }
        await self.__save__response__(response)

    async def send_json_to_room(self, room_id, data):
        await self.channel_layer.group_send(
            room_id,
            {
                'type': 'send_json',
                'data': data
            }
        )

    async def send_json_to_user(self, socket_id, data):
        await self.channel_layer.send(
            socket_id,
            {
                'type': 'send_json',
                'data': data
            }
        )

    async def send_json(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))