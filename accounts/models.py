import uuid

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

from core.utils import UsernameValidator, generate_aadhar


class UserManager(BaseUserManager):
    def get_by_natural_key(self, username):
        """
        By default, Django does a case-sensitive check on usernames. This is wrong.
        Overriding this method fixes it.
        """
        return self.get(**{self.model.USERNAME_FIELD + '__iexact': username})

    def _create_user(self, username, password, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        if not username:
            raise ValueError('The given username must be set')

        user = self.model(username=username, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(username, password, **extra_fields)

    def get_active(self, *args, **kwargs):
        return super().get(is_active=True, *args, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('', 'Not specified'),
        ('m', 'Male'),
        ('f', "Female"),
    )
    BLOOD_GROUP_CHOICES = (
        ('', 'Not specified'),
        ('A+', 'A positive'),
        ('A-', 'A negative'),
        ('B+', 'B positive'),
        ('B-', 'B negative '),
        ('O+', 'O positive'),
        ('O-', 'O negative'),
        ('AB+', 'AB positive'),
        ('AB-', 'AB negative'),
    )
    username_validator = UsernameValidator()
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    name = models.CharField(_("full name"), max_length=100, null=True, blank=True)

    username = models.CharField(
        _("username"), max_length=150, unique=True, validators=[username_validator],
        help_text=_("150 characters or fewer. Letters, digits and ./+/-/_ only."),
        error_messages={"unique": _("A user with that username already exists."), }
    )
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True)

    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(choices=GENDER_CHOICES, blank=True, max_length=1)

    image = models.ImageField(upload_to='accounts/%Y/%m/%d/', null=True, blank=True)
    is_staff = models.BooleanField(
        _("staff status"), default=False, help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _('active'), default=True, help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    date_joined = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=True)

    # EMAIL_FIELD = ""
    USERNAME_FIELD = 'username'

    objects = UserManager()

    @property
    def get_tokens(self):
        refresh = RefreshToken.for_user(self)
        tokens = {"refresh": str(refresh), "access": str(refresh.access_token)}
        return tokens


class EmailAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, error_messages={
        "unique": _("This email already exists."),
    })

    def __str__(self):
        return self.email


class Phone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone = models.CharField(unique=True, max_length=12, error_messages={
        "unique": _("This phone number already exists."),
    })

    def __str__(self):
        return self.phone


class Aadhaar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    number = models.CharField(primary_key=True, max_length=12, default=generate_aadhar)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'aadhaar'

    def __str__(self):
        return self.number
