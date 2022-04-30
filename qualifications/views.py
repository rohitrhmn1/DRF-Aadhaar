from rest_framework import views, status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.utils import response_format
from qualifications.serializers import QualificationSerializer


class QualificationView(views.APIView):
    serializer_class = QualificationSerializer
    permission_classes = [IsAuthenticated, ]
    model = serializer_class.Meta.model

    def get(self, request):
        queryset = self.model.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        context = response_format(detail="Qualification details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        context = response_format(detail="Qualification added successfully.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class QualificationDetailView(views.APIView):
    serializer_class = QualificationSerializer
    permission_classes = [IsAuthenticated, ]
    model = serializer_class.Meta.model

    def get_object(self, pk, user):
        try:
            return self.model.objects.get(pk=pk, user=user)
        except self.model.DoesNotExist:
            raise NotFound("Qualification does not exist")

    def get(self, request, pk):
        instance = self.get_object(pk, user=request.user)
        serializer = self.serializer_class(instance)
        context = response_format(detail="Qualification details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        instance = self.get_object(pk, user=request.user)
        serializer = self.serializer_class(data=request.data, instance=instance, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        context = response_format(detail="Qualification updated successfully", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        instance = self.get_object(pk, user=request.user)
        instance.delete()
        context = response_format(detail="Qualification deleted successfully", success=True)
        return Response(context, status=status.HTTP_200_OK)
