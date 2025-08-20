from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    hall = serializers.ImageField(required=True)
    kitchen = serializers.ImageField(required=True)
    bathroom = serializers.ImageField(required=True)
    bedroom1 = serializers.ImageField(required=False, allow_null=True)
    bedroom2 = serializers.ImageField(required=False, allow_null=True)
    bedroom3 = serializers.ImageField(required=False, allow_null=True)
    bedroom4 = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Property
        fields = "__all__"

    def get_hall(self, obj):
        return obj.hall.url if obj.hall else None

    def get_kitchen(self, obj):
        return obj.kitchen.url if obj.kitchen else None

    def get_bathroom(self, obj):
        return obj.bathroom.url if obj.bathroom else None

    def get_bedroom1(self, obj):
        return obj.bedroom1.url if obj.bedroom1 else None

    def get_bedroom2(self, obj):
        return obj.bedroom2.url if obj.bedroom2 else None

    def get_bedroom3(self, obj):
        return obj.bedroom3.url if obj.bedroom3 else None

    def get_bedroom4(self, obj):
        return obj.bedroom4.url if obj.bedroom4 else None
