from django.urls import path

from qualifications import views

urlpatterns = [
    path('', views.QualificationView.as_view(), name='qualification_all'),
    path('<int:pk>/', views.QualificationDetailView.as_view(), name='qualification_detail'),
]
