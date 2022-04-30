from django.contrib import admin

from qualifications.models import Qualification


class QualificationAdmin(admin.ModelAdmin):
    raw_id_fields = ['user']


admin.site.register(Qualification, QualificationAdmin)
