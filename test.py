import os
import face_recognition
import numpy as np

# Step 1: Data Collection
# Load individual student images and create a list of encodings
student_images_dir = "./user_images"
student_images = os.listdir(student_images_dir)
encodings = []

for student_image_file in student_images:
    student_image_path = os.path.join(student_images_dir, student_image_file)
    student_image = face_recognition.load_image_file(student_image_path)
    encoding = face_recognition.face_encodings(student_image)[0]
    encodings.append(encoding)

# Step 3: Model Training (This part requires a deep learning framework like TensorFlow or PyTorch)

# Step 4: Recognition
# Load the group image
group_photo_path = "./images/Image2.jpg"
group_photo = face_recognition.load_image_file(group_photo_path)
group_face_locations = face_recognition.face_locations(group_photo)
group_face_encodings = face_recognition.face_encodings(group_photo, group_face_locations)

# Compare each group face with the encodings of individual students
min_distance = 1  # You can adjust this threshold
present_students = []

for group_face_encoding in group_face_encodings:
    distances = face_recognition.face_distance(encodings, group_face_encoding)
    min_distance_index = np.argmin(distances)

    if distances[min_distance_index] < min_distance:
        present_students.append(student_images[min_distance_index])

# Print the list of present students
print("Present students:", present_students)
