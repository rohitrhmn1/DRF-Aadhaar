from django.contrib import admin

from geolocation.models import Country, State, City, Address


class CountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    list_display_links = ('name',)
    readonly_fields = ('id', "created_at", "updated_at")
    list_filter = ('is_active',)
    search_fields = ('name',)


class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    list_display_links = ('name',)
    readonly_fields = ('id', "created_at", "updated_at")
    list_filter = ('is_active', 'country')
    search_fields = ('name', 'country__name')


class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    list_display_links = ('name',)
    readonly_fields = ('id', "created_at", "updated_at")
    list_filter = ('is_active', 'state__country', 'state')
    search_fields = ('name', 'state__country__name', 'state__name')


class AddressAdmin(admin.ModelAdmin):
    list_display = ('unique_id', 'street', 'pincode', 'user',)
    list_display_links = ('unique_id',)

    search_fields = ('unique_id', 'user__username', 'street')
    readonly_fields = ('unique_id',)
    raw_id_fields = ('user',)


admin.site.register(Country, CountryAdmin)
admin.site.register(State, StateAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Address, AddressAdmin)
