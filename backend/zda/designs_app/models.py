from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


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
    code = models.TextField(blank=True, default='')
    html_code = models.TextField(blank=True, default='')
    css_code = models.TextField(blank=True, default='')
    js_code = models.TextField(blank=True, default='')
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


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, blank=True, default='')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, default='General Inquiry')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    is_public = models.BooleanField(default=False)
    design_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class CollectionDesign(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='designs')
    design = models.ForeignKey(Design, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-added_at']
        unique_together = ['collection', 'design']

    def __str__(self):
        return f"{self.collection.name} - {self.design.name}"


class DesignVersion(models.Model):
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField(default=1)
    html_code = models.TextField(blank=True, default='')
    css_code = models.TextField(blank=True, default='')
    js_code = models.TextField(blank=True, default='')
    changelog = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-version_number']
        unique_together = ['design', 'version_number']

    def __str__(self):
        return f"{self.design.name} v{self.version_number}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'design']

    def __str__(self):
        return f"{self.user.username} - {self.design.name} ({self.rating}/5)"


class DesignRemix(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='remixes')
    parent_design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='child_remixes')
    remix_design = models.OneToOneField(Design, on_delete=models.CASCADE, related_name='source_remix')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} remixed {self.parent_design.name}"


class Webhook(models.Model):
    EVENT_CHOICES = [
        ('design.created', 'Design Created'),
        ('design.updated', 'Design Updated'),
        ('design.deleted', 'Design Deleted'),
        ('design.exported', 'Design Exported'),
        ('user.registered', 'User Registered'),
        ('review.created', 'Review Created'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webhooks')
    url = models.URLField(max_length=500)
    events = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    secret = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.url}"


class WebhookDelivery(models.Model):
    webhook = models.ForeignKey(Webhook, on_delete=models.CASCADE, related_name='deliveries')
    event = models.CharField(max_length=50)
    payload = models.JSONField(default=dict)
    status_code = models.IntegerField(null=True, blank=True)
    response_body = models.TextField(blank=True, default='')
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.webhook.url} - {self.event} ({'ok' if self.success else 'fail'})"


class AnalyticsEvent(models.Model):
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('design_view', 'Design View'),
        ('design_export', 'Design Export'),
        ('design_download', 'Design Download'),
        ('search', 'Search'),
        ('signup', 'Sign Up'),
        ('login', 'Login'),
        ('review', 'Review'),
        ('remix', 'Remix'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.event_type} at {self.created_at}"


class AdminAuditLog(models.Model):
    admin_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='admin_audit_logs')
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50, blank=True, default='')
    target_id = models.IntegerField(null=True, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.admin_user} - {self.action} at {self.created_at}"


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
