from django.urls import path
from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('refresh/', views.UserTokenRefreshView.as_view(), name="refresh"),

    path('register/', views.UserRegisterView.as_view(), name="register"),
    # path('register/google/', views.GoogleRegisterView.as_view(), name="register_google"),

    path('login/', views.UserLoginView.as_view(), name="login"),
    # path('login/google/', views.GoogleLoginView.as_view(), name="login_google"),
    # path('login/phone/', views.UserPhoneNumberLogin.as_view(), name="login_phone"),

    path('profile/', views.UserProfileView.as_view(), name="profile"),
    # path('phone/', views.UserPhoneNumberModifyView.as_view(), name="phone"),

    path('email/', views.EmailListView.as_view(), name='email_list'),
    path('email/<int:email_id>/', views.EmailView.as_view(), name='email'),
    path('phone/', views.PhoneDetailView.as_view(), name='phone_list'),
    path('phone/<int:phone_id>/', views.PhoneView.as_view(), name='phone'),

    path('users/', views.UserListView.as_view(), name="profile"),
    path('password/', views.ChangePasswordView.as_view(), name="change_password"),

    path('request-reset-email/', views.UserRequestPasswordRestEmail.as_view(), name='password-reset-email'),
    path('password-token-check/', views.PasswordTokenCheckView.as_view(), name='password-token-check'),
    path('password-change-confirm/', views.UserResetPasswordView.as_view(), name='password-change-confirm'),

]
