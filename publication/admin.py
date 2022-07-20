from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Publication)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Follow)
admin.site.register(Notification)