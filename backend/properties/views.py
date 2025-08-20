from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property
from .serializers import PropertySerializer
from urbanlytics.models import User

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_property(request):
    # ✅ Find user using foreign key (email from frontend login/session)
    user_email = request.data.get("user_email")   # <-- frontend should send this
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data["user"] = user.id  # Attach FK user

    serializer = PropertySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Property submitted successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_properties(request):
    properties = Property.objects.all().order_by("-created_at")
    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def get_property(request):
    print("Request data:", request.data)
    email = request.data.get("email") if request.method == "POST" else request.query_params.get("email")
    # email = request.data.get("email")  # expecting ?email=user@example.com

    if not email:
        return Response({"success": False, "error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
        properties = Property.objects.filter(user=user).order_by("-created_at")

        property_list = []
        for prop in properties:
            property_list.append({
                "id": prop.id,
                "location": prop.location,
                "sqft": prop.sqft,
                "price": prop.price,
                "description": prop.description,
                "propertyType": prop.propertyType,
                "name": prop.name,
                "phone": prop.phone,
                "email": prop.email,
                "created_at": prop.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                # ✅ Full image URLs
                "hall": request.build_absolute_uri(prop.hall.url) if prop.hall else None,
                "kitchen": request.build_absolute_uri(prop.kitchen.url) if prop.kitchen else None,
                "bathroom": request.build_absolute_uri(prop.bathroom.url) if prop.bathroom else None,
                "bedroom1": request.build_absolute_uri(prop.bedroom1.url) if prop.bedroom1 else None,
                "bedroom2": request.build_absolute_uri(prop.bedroom2.url) if prop.bedroom2 else None,
                "bedroom3": request.build_absolute_uri(prop.bedroom3.url) if prop.bedroom3 else None,
                "bedroom4": request.build_absolute_uri(prop.bedroom4.url) if prop.bedroom4 else None,
            })

        return Response({"success": True, "properties": property_list})

    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"}, status=404)
    

@api_view(["POST"])
def search_property(request):
    location = request.data.get("location", "").strip().lower()

    if location:
        properties = Property.objects.filter(location__icontains=location)
    else:
        properties = Property.objects.all()

    serializer = PropertySerializer(properties, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_property_details(request, property_id):
    try:
        prop = Property.objects.get(id=property_id)
        serializer = PropertySerializer(prop)
        return Response(serializer.data)
    except Property.DoesNotExist:
        return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
