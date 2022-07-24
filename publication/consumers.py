import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from jwt import PyJWK
from requests import delete
from profiles.models import *
from publication.models import Follow, Notification
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
        print(data_dict)
        if(data_dict.get('type')=='invitation'):
            invitor = data_dict.get('invitor')
            invited = data_dict.get('invited')
            print()
            await self.create_invitation(invitor,invited)
            notif = await self.create_notification(invitor,invited,'invitation')
            dict_to_send = {
                'type':'invitation',
                'doer' : {
                    'id' : invitor,
                    'username' : notif.doer.username
                } ,
                'to':invited, 
                'id' : notif.id , 
            }
            await self.channel_layer.group_send(
                self.notification_group_name,
                {
                    'type': 'chat_message',
                    'message' :dict_to_send
                }
            )
        elif(data_dict.get('type')=='acceptation'):
            invitor = data_dict.get('invitor')
            invited = data_dict.get('invited')
            notif = await self.create_notification(invited,invitor,'acceptation')
            id = data_dict.get('id')
            dict_to_send = {
                'type':'acceptation',
                'doer' : {
                    'id' : invitor,
                    'username' : notif.doer.username
                } ,
                'to':invited, 
                'id' : notif.id , 
            }
            await self.create_follow(invitor ,invited)
            await self.delete_invitation(data_dict.get('invitor') ,data_dict.get('invited'))
            await self.delete_notification(id)
            await self.channel_layer.group_send(
                self.notification_group_name,
                {
                    'type': 'chat_message',
                    'message' :dict_to_send
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
        inv = Invitation.objects.create(invitor=Profile.objects.get(pk=pk_invitor) , invited = Profile.objects.get(pk=pk_invited))
        print(inv)
    @database_sync_to_async
    def create_notification(self , pk_doer,pk_to , type):
        notification = Notification.objects.create(doer=Profile.objects.get(pk=pk_doer) ,to = Profile.objects.get(pk=pk_to) , type =type)
        return notification
    @database_sync_to_async
    def delete_notification(self ,pk):
        notif = Notification.objects.get(pk=pk)
        print(notif)
        notif.delete()
    @database_sync_to_async
    def delete_invitation(self ,pk_invitor , pk_invited):
        Invitation.objects.get(invitor = Profile.objects.get(pk = pk_invitor) , invited= Profile.objects.get(pk=pk_invited)).delete()
    @database_sync_to_async
    def create_follow(self , follower , following):
        Follow.objects.create(follower = Profile.objects.get(pk = follower) , following= Profile.objects.get(pk=following))