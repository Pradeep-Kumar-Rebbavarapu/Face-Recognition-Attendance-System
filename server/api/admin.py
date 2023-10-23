from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(GroupPhoto)
class GroupPhotoAdmin(admin.ModelAdmin):
    
    list_display = ['id','image','total_number_of_students_identified','image_preview']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):   
    ordering=['roll_number']
    search_fields=['roll_number','name']
    list_filter = ['branch','year','course']
    readonly_fields = ['image1_preview','image2_preview']
    list_display = ['id','roll_number','name','year','course','branch','image1_preview','image2_preview']

    

    def compute_face_encodings(self, image_path):
        try:
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            return encodings
        except Exception as e:
            print(f"Error computing encodings for {image_path}: {e}")
            return []
        

    def image1_preview(self, obj):
        return obj.image1_preview

    def image2_preview(self, obj):
        return obj.image2_preview
    
    image2_preview.short_description = "Image1 Preview"
    image2_preview.allow_tags = True

    image2_preview.short_description = "Image2 Preview"
    image2_preview.allow_tags = True

    fieldsets = (
        (
            None,
            {
                "fields": (
                    ("name", "roll_number"),
                    ("course","branch","year",),
                    ("image1", "image1_preview"),
                    ("image2", "image2_preview"),
                )
            },
        ),
    )


