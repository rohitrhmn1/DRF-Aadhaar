from rest_framework import serializers

from qualifications.models import Qualification


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = ('id', 'institution_name', 'year_of_passing', 'percentage')
