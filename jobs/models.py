from django.db import models

from accounts.models import User


class PastJobExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    job_role = models.CharField(max_length=100)
    years_of_experience = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"{self.user}: {self.job_role}, {self.years_of_experience}"
