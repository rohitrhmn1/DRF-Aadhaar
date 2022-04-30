from django.urls import path

from jobs import views

urlpatterns = [
    path('', views.JobView.as_view(), name='jobs_all'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job_detail'),
]
