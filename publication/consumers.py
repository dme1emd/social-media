import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from profiles.models import *
from publication.models import Notification
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.notified = self.scope['url_route']['kwargs']['notified']
        self.notification_group_name = '%s' % self.notified
        # Join room group
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )
    # Receive message from WebSocket
    async def receive(self, text_data):
        data_dict = json.loads(text_data)
        invitor = data_dict['invitor']
        invited =data_dict['invited']
        print(invitor , invited)
        print('heu')
        await self.create_invitation(invitor,invited)
        await self.create_notification(invitor,invited,'invitation')
        await self.channel_layer.group_send(
            self.notification_group_name,
            {
                'type': 'chat_message',
                'message' :'invited'
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
    @database_sync_to_async
    def create_invitation(self,pk_invitor , pk_invited):
        print("creating ...")
        Invitation.objects.create(invitor=Profile.objects.get(pk=pk_invitor) , invited = Profile.objects.get(pk=pk_invited))
    @database_sync_to_async
    def create_notification(self , pk_doer,pk_to , type):
        Notification.objects.create(doer=Profile.objects.get(pk=pk_doer) ,to = Profile.objects.get(pk=pk_to) , type =type)