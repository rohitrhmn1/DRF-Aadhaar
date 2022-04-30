from django.urls import path

from banks import views

urlpatterns = [
    path('', views.BankView.as_view(), name='bank_all'),
    path('<int:pk>/', views.BankDetailView.as_view(), name='bank_detail'),
]
