from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Design(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default='Landing')
    framework = models.CharField(max_length=100, default='React')
    price = models.CharField(max_length=20, default='Free')
    score = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    exports = models.IntegerField(default=0)
    description = models.TextField(default='')
    preview_image = models.URLField(max_length=500, blank=True, default='')
    uploaded_file = models.FileField(upload_to='designs/previews/', blank=True, default='')
    file_type = models.CharField(max_length=20, choices=[
        ('image', 'Image'),
        ('video', 'Video'),
        ('url', 'URL'),
    ], default='url')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score', '-created_at']

    def __str__(self):
        return self.name

    def get_preview_url(self):
        if self.uploaded_file:
            return self.uploaded_file.url
        return self.preview_image


class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('register', 'Register'),
        ('export', 'Export Design'),
        ('view', 'View Design'),
        ('block', 'Block User'),
        ('unblock', 'Unblock User'),
        ('delete_user', 'Delete User'),
        ('threat_detected', 'Threat Detected'),
        ('scan', 'Security Scan'),
        ('api_access', 'API Access'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=150, default='')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    detail = models.TextField(default='')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.username} - {self.action}"


class BlockedIP(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    reason = models.TextField(default='')
    blocked_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-blocked_at']

    def __str__(self):
        return f"{self.ip_address} - {self.reason}"


class ThreatAlert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    threat_type = models.CharField(max_length=100)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    blocked = models.BooleanField(default=False)
    resolved = models.BooleanField(default=False)
    detected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-detected_at']

    def __str__(self):
        return f"[{self.severity}] {self.threat_type}"


class UserDownload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    design_id = models.IntegerField()
    design_name = models.CharField(max_length=200, default='')
    downloaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-downloaded_at']

    def __str__(self):
        return f"{self.user.username} downloaded {self.design_name}"
