from django.contrib import admin

# Register your models here.
from banks.models import Bank


class BankAdmin(admin.ModelAdmin):
    raw_id_fields = ['user']


admin.site.register(Bank, BankAdmin)
