from django.contrib import admin
from .models import ActivityLog, BlockedIP, ThreatAlert, UserDownload


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'username', 'action', 'ip_address']
    list_filter = ['action', 'timestamp']
    search_fields = ['username', 'detail']


@admin.register(BlockedIP)
class BlockedIPAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'reason', 'is_active', 'blocked_at']
    list_filter = ['is_active']


@admin.register(ThreatAlert)
class ThreatAlertAdmin(admin.ModelAdmin):
    list_display = ['threat_type', 'severity', 'blocked', 'resolved', 'detected_at']
    list_filter = ['severity', 'blocked', 'resolved']


@admin.register(UserDownload)
class UserDownloadAdmin(admin.ModelAdmin):
    list_display = ['user', 'design_name', 'downloaded_at']
    list_filter = ['downloaded_at']
