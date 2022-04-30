import threading
import uuid
from collections import OrderedDict

from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.db import models
from django.template.loader import get_template
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from rest_framework.views import exception_handler as base_exception_handler


class ModelManager(models.Manager):
    def filter_active(self, *args, **kwargs):
        return super().filter(is_active=False, *args, **kwargs)


def get_expiry():
    return timezone.now() + timezone.timedelta(days=14)


class UsernameValidator(UnicodeUsernameValidator):
    regex = r"^[\w.+-]+\Z"
    message = _(
        "Enter a valid username. This value may contain only letters, "
        "numbers, and ./+/-/_ characters."
    )
    flags = 0


def human_format(num):
    magnitude = 0
    notation = ['', 'K', 'M', 'G', 'T', 'P']
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    if num % 1 == 0:
        return '%i%s' % (num, notation[magnitude])
    return '%.2f%s' % (num, notation[magnitude])


def response_format(detail, data=None, success=False):
    return OrderedDict([
        ('success', success),
        ('detail', detail),
        ('data', data),
    ])


def exception_handler(exc, context):
    response = base_exception_handler(exc, context)

    if response is not None:
        non_field_errors = response.data.get('non_field_errors')
        error_detail = " ".join(response.data.get('non_field_errors')) if non_field_errors else response.data.get(
            'detail') or exc.detail
        response.data = response_format(detail=error_detail)
    return response


class EmailThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()


def send_email(data):
    email = EmailMessage(subject=data['email_subject'], body=data['email_body'], to=[data['to_email']])
    EmailThread(email).start()


def send_templated_email(subject, template, email):
    email = EmailMultiAlternatives(subject=subject, to=[email])
    email.attach_alternative(template, "text/html")
    EmailThread(email).start()


def get_password_reset_template(reset_link):
    return get_template('mails/password-reset-template.html').render({'reset_link': reset_link})


def get_password_reset_complete_template():
    return get_template('mails/password-reset-complete.html').render()


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsSuperUser(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.is_superuser


class IsStaffUser(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.is_staff


class IsNormalUser(IsStaffUser):
    def has_permission(self, request, view):
        is_staff = super().has_permission(request, view)
        return not is_staff


def generate_aadhar():
    return str(int(uuid.uuid4()))[:12]
