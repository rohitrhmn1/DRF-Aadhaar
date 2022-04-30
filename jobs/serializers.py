from rest_framework import serializers

from jobs.models import PastJobExperience


class PastJobExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastJobExperience
        fields = ('id', 'company_name', 'job_role', 'years_of_experience')
