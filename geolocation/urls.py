from django.urls import path

from geolocation import views

urlpatterns = [
    path('', views.AddressView.as_view(), name='address_all'),
    path('<uuid:uuid>/', views.AddressDetailView.as_view(), name='address_all'),
]
