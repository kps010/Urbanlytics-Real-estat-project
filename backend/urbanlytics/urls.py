from django.urls import path,include
from . import views
# from .views import predict_price

urlpatterns = [
    # path('predict/', predict_price),'
    path("predict/",views.price_predictor,name="predict"),
    path("login/",views.login_view,name="login"),
    path("register/",views.register_view,name="login"),
    path("logout/",views.logout_view,name="login"),
    path("check-login/",views.check_logged_in_user,name="check-login"),
    path("user-profile/",views.user_profile,name="user-profile"),
    path("update-profile/",views.update_profile,name="user-profile"),
    path("subscribe/", views.create_subscription, name="create_subscription"),
    path("subscriptions/<str:email>/", views.get_user_subscriptions, name="get_user_subscriptions"),
]
