from django.contrib import admin

from jobs.models import PastJobExperience


class PastJobExperienceAdmin(admin.ModelAdmin):
    raw_id_fields = ['user']


admin.site.register(PastJobExperience, PastJobExperienceAdmin)
