from rest_framework import serializers

from geolocation.models import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'unique_id', 'street', 'state', 'city', 'pincode',
        )
        read_only_fields = ('unique_id',)
