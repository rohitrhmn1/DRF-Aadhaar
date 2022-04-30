# Generated by Django 4.0.4 on 2022-04-29 09:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_emailaddress_phone_remove_user_email_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='aadhaar',
            options={'verbose_name_plural': 'aadhaar'},
        ),
        migrations.RenameField(
            model_name='address',
            old_name='line_2',
            new_name='state',
        ),
        migrations.RenameField(
            model_name='address',
            old_name='line_1',
            new_name='street',
        ),
        migrations.RemoveField(
            model_name='address',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='address',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='address',
            name='landmark',
        ),
        migrations.RemoveField(
            model_name='address',
            name='updated_at',
        ),
    ]
