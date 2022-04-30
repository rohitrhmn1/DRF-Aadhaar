from django.urls import path, include

urlpatterns = [
    path('auth/', include('accounts.urls')),
    path('address/', include('geolocation.urls')),
    path('bank/', include('banks.urls')),
    path('jobs/', include('jobs.urls')),
    path('qualifications/', include('qualifications.urls')),
    path('search/', include('search.urls')),
]
