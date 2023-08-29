from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(GroupPhoto)
class GroupPhotoAdmin(admin.ModelAdmin):
    list_display = ['id','image','total_number_of_students']