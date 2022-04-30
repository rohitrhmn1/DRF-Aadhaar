import uuid

from django.db import models

from accounts.models import User
from core.utils import ModelManager


class Country(models.Model):
    name = models.CharField(max_length=250)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    objects = ModelManager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'countries'


class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    objects = ModelManager()

    def __str__(self):
        return f"{self.country}: {self.name}"

    class Meta:
        verbose_name_plural = 'states'


class City(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    objects = ModelManager()

    def __str__(self):
        return f"{self.state.country}: {self.state.name}: {self.name}"

    class Meta:
        verbose_name_plural = 'cities'


class Address(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    street = models.CharField(max_length=250)
    state = models.CharField(max_length=250, null=True, blank=True)

    city = models.CharField(max_length=250)
    pincode = models.CharField(max_length=6)

    def __str__(self):
        return f"{self.unique_id} {self.user} {self.street}"

    class Meta:
        verbose_name_plural = 'addresses'
