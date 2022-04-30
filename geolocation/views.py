from rest_framework import views, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils import response_format
from geolocation.serializers import AddressSerializer


class AddressView(views.APIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, ]
    model = serializer_class.Meta.model

    def get(self, request):
        queryset = self.model.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        context = response_format(detail="Address details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        context = response_format(detail="Address added successfully.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class AddressDetailView(views.APIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated, ]
    model = serializer_class.Meta.model

    def get_object(self, uuid, user):
        try:
            return self.model.objects.get(pk=uuid, user=user)
        except self.model.DoesNotExist:
            raise NotFound("Address does not exist")

    def get(self, request, uuid):
        address = self.get_object(uuid, user=request.user)
        serializer = self.serializer_class(address)
        context = response_format(detail="Address details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def patch(self, request, uuid):
        address = self.get_object(uuid, user=request.user)
        serializer = self.serializer_class(data=request.data, instance=address, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        context = response_format(detail="Address updated successfully", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def delete(self, request, uuid):
        address = self.get_object(uuid, user=request.user)
        address.delete()
        context = response_format(detail="Address deleted successfully", success=True)
        return Response(context, status=status.HTTP_200_OK)
