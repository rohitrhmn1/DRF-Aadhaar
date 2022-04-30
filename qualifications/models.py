from django.db import models

from accounts.models import User


class Qualification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    institution_name = models.CharField(max_length=100)
    year_of_passing = models.CharField(max_length=4)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user}: {self.year_of_passing}, {self.percentage}"
