from django.contrib.auth import authenticate, password_validation
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.encoding import smart_str, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework_simplejwt.settings import api_settings as jwt_settings

from accounts.models import User, EmailAddress, Phone, Aadhaar
from banks.serializers import BankSerializer
from geolocation.serializers import AddressSerializer
from jobs.serializers import PastJobExperienceSerializer
from qualifications.serializers import QualificationSerializer


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    password1 = serializers.CharField(max_length=50, min_length=8, required=True, write_only=True)
    password2 = serializers.CharField(max_length=50, min_length=8, required=True, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')

    def validate(self, attrs):
        username = attrs.get('username')
        password1 = attrs.get('password1')
        password2 = attrs.get('password2')
        email_check = self.Meta.model.objects.filter(username__iexact=username).first()
        if email_check:
            raise AuthenticationFailed(detail="User with this username already exists.")
        if password2 != password1:
            raise ValidationError(detail="Passwords do not match.")
        try:
            validate_password(password1)
        except DjangoValidationError as error:
            raise ValidationError(detail=error.messages)
        user = self.Meta.model.objects.create_user(password=password2, username=username)
        data = user.get_tokens
        return data


class UserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(min_length=3, required=True)
    password = serializers.CharField(max_length=50, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def get_user_by_username(self, username):
        try:
            return self.Meta.model.objects.get(username__iexact=username)
        except self.Meta.model.DoesNotExist:
            raise AuthenticationFailed("User does not exist.")

    def validate(self, attrs):
        username = attrs.get('username', None)
        password = attrs.get('password', None)
        self.get_user_by_username(username=username)
        user = authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed('Invalid credentials.')
        data = user.get_tokens
        if jwt_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, user)
        return data


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=50, required=True, write_only=True, min_length=8)
    new_password1 = serializers.CharField(max_length=50, required=True, write_only=True, min_length=8)
    new_password2 = serializers.CharField(max_length=50, required=True, write_only=True, min_length=8)

    def validate(self, attrs):
        email = self.context.get('email')
        old_password = attrs.get('old_password')
        new_password1 = attrs.get('new_password1')
        new_password2 = attrs.get('new_password2')
        user = authenticate(email=email, password=old_password)
        if not user:
            raise AuthenticationFailed("Invalid credentials.")
        if new_password1 != new_password2:
            raise ValidationError(detail="Passwords do not match.")
        try:
            validate_password(new_password1)
        except DjangoValidationError as error:
            raise ValidationError(detail=error.messages)
        if new_password1 == old_password:
            raise ValidationError("New password cannot be same as old password.")
        user.set_password(new_password2)
        user.save()
        return True

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class RequestPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ('email',)

    def validate(self, attrs):
        try:
            email = attrs.get('email')
            user = User.objects.get(email__icontains=email)
            uidb64 = urlsafe_base64_encode(str(user.unique_id).encode('utf-8'))
            token = PasswordResetTokenGenerator().make_token(user)
            data = {'email': email, 'uidb64': uidb64, 'token': token}
        except User.DoesNotExist:
            raise AuthenticationFailed("User is not registered.")
        return data

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class PasswordTokenCheckSerializer(serializers.Serializer):
    token = serializers.CharField(min_length=1, required=True, write_only=True)
    uidb64 = serializers.CharField(min_length=1, required=True, write_only=True)

    class Meta:
        fields = ('uidb64', 'token')

    def validate(self, attrs):
        uidb64 = attrs.get('uidb64')
        token = attrs.get('token')
        try:
            unique_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(unique_id=unique_id)
            if not PasswordResetTokenGenerator().check_token(user=user, token=token):
                raise AuthenticationFailed("The link is expired or invalid. Request link again.")
            return unique_id
        except ValueError:
            raise AuthenticationFailed("Invalid password reset link. Try again.")

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class UserResetPasswordSerializer(serializers.Serializer):
    password1 = serializers.CharField(min_length=6, required=True, write_only=True)
    password2 = serializers.CharField(min_length=6, required=True, write_only=True)
    token = serializers.CharField(min_length=1, required=True, write_only=True)
    uidb64 = serializers.CharField(min_length=1, required=True, write_only=True)

    class Meta:
        fields = ('password1', 'password2', 'token', 'uidb64')

    def validate(self, attrs):
        try:
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            unique_id = force_str(urlsafe_base64_decode(uidb64))
            password1 = attrs.get('password1')
            password2 = attrs.get('password2')
            if password1 != password2:
                raise AuthenticationFailed('Passwords does not match.')
            user = User.objects.get(unique_id=unique_id)
            password_validation.validate_password(password1, user=user)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid or expired.')
            user.set_password(password1)
            user.save()
            email = user.email
        except ValueError:
            raise AuthenticationFailed("The reset link is invalid.")
        except User.DoesNotExist:
            raise AuthenticationFailed("The associated user does not exist.")
        return email

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAddress
        fields = ('id', 'email',)


class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = ('id', 'phone',)


class AadhaarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aadhaar
        fields = ('number', 'is_active')


class UserSerializer(serializers.ModelSerializer):
    email = EmailSerializer(many=True, required=False, source='emailaddress_set')
    phone = PhoneSerializer(many=True, required=False, source='phone_set')
    address = AddressSerializer(many=True, required=False, source='address_set')
    qualification = QualificationSerializer(many=True, source='qualification_set')
    past_job_experience = PastJobExperienceSerializer(many=True, source='pastjobexperience_set')
    aadhaar = AadhaarSerializer(required=False)
    bank = BankSerializer(many=True, source='bank_set')

    class Meta:
        model = User
        fields = (
            'name', 'username', 'date_of_birth', 'gender', 'date_joined', 'blood_group',
            'last_login', 'unique_id', 'is_active', 'is_staff', 'is_superuser', 'image',
            'email', 'phone', 'address', 'qualification', 'past_job_experience', 'aadhaar', 'bank'
        )
        read_only_fields = (
            "unique_id", "username", "date_joined", "last_login",
            "is_active", "is_staff", "is_superuser", 'auth_provider',
        )

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        # ret['gender'] = obj.get_gender_display()
        return ret
