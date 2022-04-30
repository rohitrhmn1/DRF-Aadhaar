from rest_framework import views, status
from rest_framework.exceptions import ParseError, NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.serializers import UserSerializer
from core.utils import response_format, ReadOnly


class SearchView(views.APIView):
    serializer_class = UserSerializer
    model = serializer_class.Meta.model
    # permission_classes = [IsAuthenticated | ReadOnly]

    def get(self, request):
        data = {}
        query = request.GET.get('aadhaar', None)
        filter_user = request.GET.get('filter_active', False)
        if not query:
            raise ParseError("Enter aadhaar number")
        if int(filter_user):
            instance = self.model.objects.filter(aadhaar__number__iexact=query, is_active=False).first()
        else:
            instance = self.model.objects.filter(aadhaar__number__iexact=query).first()
        if instance:
            serializer = self.serializer_class(instance)
            data = serializer.data
        context = response_format(detail="Search details", data=data, success=True)
        return Response(context, status=status.HTTP_200_OK)
