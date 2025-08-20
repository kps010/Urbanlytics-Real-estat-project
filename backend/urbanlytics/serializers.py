from rest_framework import serializers
from .models import Subscription, User

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"

    def create(self, validated_data):
        email = validated_data.pop("email")
        user = User.objects.get(email=email)
        validated_data["user"] = user
        return super().create(validated_data)