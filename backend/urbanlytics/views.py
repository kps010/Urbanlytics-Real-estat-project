from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .models import User
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def price_predictor(request):
    sqft = int(request.data.get('sqft'))
    location = request.data.get('location')
    bhk = request.data.get('propertyType')

    
    df = pd.read_csv(r'.\assets\ahmedabad_cleaned.csv')

    # --- Clean & Preprocess ---

    df['total_sqft'] = df['total_sqft'].apply(parse_sqft)
    df = df[df['total_sqft'].notnull() & df['price'].notnull()]
    df['location'] = df['location'].astype(str).str.strip().str.lower()

    # Remove outliers using price per sqft
    mean_pps = df['price_sqft'].mean()
    std_pps = df['price_sqft'].std()
    df = df[(df['price_sqft'] > (mean_pps - 2 * std_pps)) & 
            (df['price_sqft'] < (mean_pps + 2 * std_pps))]

    # --- Global Variables ---
    location_counts = df['location'].value_counts()
    all_locations = set(df['location'].unique())
    price = predict_price(df,sqft,location, bhk,location_counts,all_locations)

    return Response({"message": "Hello, world!","price":price})


def parse_sqft(val):
    try:
        if '-' in str(val):
            low, high = map(float, val.split('-'))
            return (low + high) / 2
        return float(str(val).split()[0])
    except:
        return np.nan

def build_pipeline():
    preprocessor = ColumnTransformer(
        transformers=[('location', OneHotEncoder(handle_unknown='ignore'), ['location']),
                      ('numeric', StandardScaler(), ['bhk', 'total_sqft'])],
        remainder='passthrough'
    )
    return Pipeline([
        ('preprocessor', preprocessor),
        ('model', RandomForestRegressor(n_estimators=200, random_state=42))
    ])

def find_best_match(location,location_counts,all_locations):
    location = location.strip().lower()
    matches = [loc for loc in all_locations if location in loc or loc in location]
    return max(matches, key=lambda x: location_counts.get(x, 0)) if matches else None


# --- Prediction ---
def predict_price(df,sqft, location,bhk,location_counts,all_locations):
    matched = find_best_match(location,location_counts,all_locations)
    if not matched:
        return f"Location '{location}' not found."

    subset = df[df['location'] == matched]
    if len(subset) < 10:
        return f"Not enough data for location '{matched.title()}' ({len(subset)} records)."

    X = subset[['total_sqft', 'location','bhk']]
    y = subset['price']

    pipeline = build_pipeline()
    pipeline.fit(X, y)

    # Save model to disk
    model_filename = f"model_{matched.replace(' ', '_')}.pkl"
    joblib.dump(pipeline, model_filename)



    input_data = pd.DataFrame([[sqft, matched,bhk]], columns=['total_sqft', 'location','bhk'])
    price = pipeline.predict(input_data)[0]
    return f"Estimated price for {sqft} sq.ft in '{location.title()}' (matched as '{matched.title()}' for {bhk}bhk): ₹{price:.2f} Lakhs"

@api_view(['POST'])  # Allow POST
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('pass')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "User not registered"}, status=status.HTTP_404_NOT_FOUND)
    
    
    if user.password == password:  # use hashed in real apps
        user.loggedIn = True
        user.save()
        return Response({"message": "Login successful", "user": user.name}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_view(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('pass')
    phone = request.data.get('phone')

    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create(
        name=name,
        email=email,
        password=password,  # Hash in real projects
        phone_no=phone,
        loggedIn=True   # set loggedIn True on registration
    )

    return Response({"message": "User registered successfully", "user": user.name}, status=status.HTTP_201_CREATED)



@api_view(['GET'])
def check_logged_in_user(request):
    user = User.objects.filter(loggedIn=True).first()  # get first logged-in user
    email = user.email
    if user:
        print("logged in ",email)
        return Response({"loggedIn": True, "email": email})
    else:
        return Response({"loggedIn": False})
    
@api_view(['POST'])
def logout_view(request):
    email = request.data.get('userEmail')
    user = User.objects.filter(email=email).first()
    user.loggedIn = False
    user.save()

    return Response({"success": True, "message": "Logout successful"}, status=status.HTTP_200_OK)

    
@api_view(['GET'])
def user_profile(request):
    email = request.GET.get("email")  #  query param
    if not email:
        return Response({"success": False, "error": "Email is required"})

    try:
        user = User.objects.get(email=email)
        profile_data = {
            "email": user.email,
            "name": user.name,
            "phone_no": user.phone_no,
        }
        return Response({"success": True, "user": profile_data})
    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"})
    
@api_view(['PUT'])
def update_profile(request):
    email = request.data.get("email")
    name = request.data.get("name")
    phone_no = request.data.get("phone_no")

    try:
        user = User.objects.get(email=email)

        if name:
            user.name = name   # if your User model has `name` field
        if phone_no:
            user.phone_no = phone_no  # if your User model has `phone_no` field

        user.save()

        return Response({
            "success": True,
            "user": {
                "name": user.name,
                "email": user.email,
                "phone_no": user.phone_no,
            }
        })
    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"}, status=404)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.parsers import MultiPartParser, FormParser
# from properties.models import Property
# from properties.serializers import PropertySerializer
# from .models import User

# @api_view(["POST"])
# @parser_classes([MultiPartParser, FormParser])
# def upload_property(request):
#     #  Find user using foreign key (email from frontend login/session)
#     user_email = request.data.get("user_email")   
#     try:
#         user = User.objects.get(email=user_email)
#     except User.DoesNotExist:
#         return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#     data = request.data.copy()
#     data["user"] = user.id  # Attach FK user

#     serializer = PropertySerializer(data=data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Property submitted successfully!"}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from datetime import timedelta, date
from .models import Subscription, User
from .serializers import SubscriptionSerializer
from decimal import Decimal

@api_view(['POST'])
def create_subscription(request):
    try:
        email = request.data.get("email")  
        plan = request.data.get("plan")
        payment_method = request.data.get("payment_method")

        # Plan Prices
        # prices = {"basic": 499, "premium": 999, "elite": 1999}
        amount = Decimal(str(request.data.get("amount")))
        # Expiry = +30 days
        expiry_date = date.today() + timedelta(days=30)

        # Ensure user exists
        user = User.objects.get(email=email)   #  lookup by email

        subscription = Subscription.objects.create(
            user=user,
            plan=plan,
            amount=amount,
            payment_method=payment_method,
            expiry_date=expiry_date,
        )

        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_subscriptions(request, email):
    try:
        user = User.objects.get(email=email)
        subs = Subscription.objects.filter(user=user)
        serializer = SubscriptionSerializer(subs, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
