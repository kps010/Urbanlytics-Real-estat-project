import os
from django.db import models
from urbanlytics.models import User

def user_directory_path(instance, filename, field_name):
    safe_email = instance.user.email.replace("@", "_at_")
    # This will create a path like: properties/user_email/field_name/filename.jpg
    return os.path.join(
        "properties",
        safe_email,              # user’s email folder
        field_name,  # field name (hall, bedroom1, etc.)
        filename
    )

def upload_to_hall(instance, filename):
    return user_directory_path(instance, filename, "hall")

def upload_to_bedroom1(instance, filename):
    return user_directory_path(instance, filename, "bedroom1")

def upload_to_bedroom2(instance, filename):
    return user_directory_path(instance, filename, "bedroom2")

def upload_to_bedroom3(instance, filename):
    return user_directory_path(instance, filename, "bedroom3")

def upload_to_bedroom4(instance, filename):
    return user_directory_path(instance, filename, "bedroom4")

def upload_to_kitchen(instance, filename):
    return user_directory_path(instance, filename, "kitchen")

def upload_to_bathroom(instance, filename):
    return user_directory_path(instance, filename, "bathroom")


class Property(models.Model):
    PROPERTY_CHOICES = [
        ("1BHK", "1 BHK"),
        ("2BHK", "2 BHK"),
        ("3BHK", "3 BHK"),
        ("4BHK", "4 BHK"),
    ]

    #  Link to User
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="properties")

    location = models.TextField()
    sqft = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    description = models.TextField()
    propertyType = models.CharField(max_length=10, choices=PROPERTY_CHOICES)

    # Contact details
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()

    #  Dynamic file paths
    hall = models.ImageField(upload_to=upload_to_hall)
    kitchen = models.ImageField(upload_to=upload_to_kitchen)
    bathroom = models.ImageField(upload_to=upload_to_bathroom)

    bedroom1 = models.ImageField(upload_to=upload_to_bedroom1, null=True, blank=True)
    bedroom2 = models.ImageField(upload_to=upload_to_bedroom2, null=True, blank=True)
    bedroom3 = models.ImageField(upload_to=upload_to_bedroom3, null=True, blank=True)
    bedroom4 = models.ImageField(upload_to=upload_to_bedroom4, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.propertyType} in {self.location} - {self.price}"
