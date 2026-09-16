import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DesignConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'designs'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def design_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'design_updated',
            'design': event.get('design', {}),
            'action': event.get('action', 'update'),
        }))
