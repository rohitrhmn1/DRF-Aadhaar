from django.db import models

from accounts.models import User


class Bank(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_number = models.CharField(max_length=50, unique=True, error_messages={
        'unique': 'A bank account with the account number already exists.'
    })
    bank_name = models.CharField(max_length=50)
    ifsc_code = models.CharField(max_length=11)

    def __str__(self):
        return f"{self.user}:{self.bank_name}"
