from accounts.models import EmailAddress, Phone
from core.utils import (
    response_format, get_password_reset_template,
    send_templated_email, get_password_reset_complete_template, ReadOnly
)
from core.utils import IsSuperUser
from rest_framework import views, status
from rest_framework.exceptions import ParseError, NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings as rest_framework_settings
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.serializers import (
    UserRegisterSerializer, UserLoginSerializer, UserSerializer,
    RequestPasswordResetEmailSerializer, PasswordTokenCheckSerializer,
    UserResetPasswordSerializer, PasswordChangeSerializer, EmailSerializer, PhoneSerializer
)


class UserListView(views.APIView):
    permission_classes = [IsSuperUser]
    pagination_class = rest_framework_settings.DEFAULT_PAGINATION_CLASS
    serializer_class = UserSerializer

    def get(self, request):
        queryset = self.serializer_class.Meta.model.objects.all()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset=queryset, request=request)
        serializer = self.serializer_class(page, many=True)
        response = paginator.get_paginated_response(data=serializer.data, detail="Users list.", success=True)
        return response


class UserTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh = request.data.get('refresh')
        if not refresh:
            raise ParseError(detail="Refresh token is required.")
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(detail=e.args[0])
        context = response_format(detail="Token refreshed.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserRegisterView(views.APIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        context = response_format(detail="User registered.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserLoginView(views.APIView):
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        context = response_format(detail="User logged in.", data=serializer.validated_data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'email': request.user.email})
        serializer.is_valid(raise_exception=True)
        context = response_format("Password changed successfully.", success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserRequestPasswordRestEmail(views.APIView):
    serializer_class = RequestPasswordResetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')
        uidb64 = serializer.validated_data.get('uidb64')
        token = serializer.validated_data.get('token')
        current_site = f"{request.host}://{request.get_host()}"
        relativeLink = f"/password-reset?uidb64={uidb64}&token={token}"
        total_url = current_site + relativeLink
        template = get_password_reset_template(reset_link=total_url)
        send_templated_email(subject='Reset your password', template=template, email=email)
        context = response_format(detail="Email sent.", success=True)
        return Response(context, status=status.HTTP_200_OK)


class PasswordTokenCheckView(views.APIView):
    serializer_class = PasswordTokenCheckSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        context = response_format(detail="Token is valid.", success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserResetPasswordView(views.APIView):
    serializer_class = UserResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data
        template = get_password_reset_complete_template()
        send_templated_email(subject='Password changed successfully', template=template, email=email)
        context = response_format(detail='Password reset completed.', success=True)
        return Response(context, status=status.HTTP_200_OK)


class UserProfileView(views.APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        serializer = self.serializer_class(request.user)
        context = response_format(detail="Your profile.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        context = response_format(detail="Profile updated.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class EmailListView(views.APIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated, ]
    model = EmailAddress

    def get(self, request):
        queryset = self.model.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        context = response_format(detail="All emails registered.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        context = response_format(detail="Email added successfully.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class EmailView(views.APIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated, ]
    model = EmailAddress

    def get_object(self, email_id, user):
        try:
            return self.model.objects.get(pk=email_id, user=user)
        except self.model.DoesNotExist:
            raise NotFound("Email address does not exist")

    def get(self, request, email_id):
        email = self.get_object(email_id, user=request.user)
        serializer = self.serializer_class(email)
        context = response_format(detail="Email details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def patch(self, request, email_id):
        email = self.get_object(email_id, user=request.user)
        serializer = self.serializer_class(data=request.data, instance=email, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        context = response_format(detail="Email updated successfully", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def delete(self, request, email_id):
        email = self.get_object(email_id, user=request.user)
        email.delete()
        context = response_format(detail="Email deleted successfully", success=True)
        return Response(context, status=status.HTTP_200_OK)


class PhoneDetailView(views.APIView):
    serializer_class = PhoneSerializer
    permission_classes = [IsAuthenticated, ]
    model = Phone

    def get(self, request):
        queryset = self.model.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        context = response_format(detail="Phone number details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        # if  not request.user.is_
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        context = response_format(detail="Phone number added successfully.", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)


class PhoneView(views.APIView):
    serializer_class = PhoneSerializer
    permission_classes = [IsAuthenticated, ]
    model = Phone

    def get_object(self, phone_id, user):
        try:
            return self.model.objects.get(pk=phone_id, user=user)
        except self.model.DoesNotExist:
            raise NotFound("Phone number does not exist")

    def get(self, request, phone_id):
        phone = self.get_object(phone_id, user=request.user)
        serializer = self.serializer_class(phone)
        context = response_format(detail="Phone number details", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def patch(self, request, phone_id):
        phone = self.get_object(phone_id, user=request.user)
        serializer = self.serializer_class(data=request.data, instance=phone, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        context = response_format(detail="Phone number updated successfully", data=serializer.data, success=True)
        return Response(context, status=status.HTTP_200_OK)

    def delete(self, request, phone_id):
        phone = self.get_object(phone_id, user=request.user)
        phone.delete()
        context = response_format(detail="Phone number deleted successfully", success=True)
        return Response(context, status=status.HTTP_200_OK)
