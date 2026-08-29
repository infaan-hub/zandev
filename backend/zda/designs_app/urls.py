from django.urls import path
from . import views
from . import auth_views
from . import admin_views

urlpatterns = [
    path('health/', views.HealthView.as_view(), name='health'),
    path('designs/', views.DesignListView.as_view(), name='design-list'),
    path('designs/<int:pk>/', views.DesignDetailView.as_view(), name='design-detail'),
    path('designs/<int:pk>/export/', views.DesignExportView.as_view(), name='design-export'),
    path('stats/', views.StatsView.as_view(), name='stats'),
    path('auth/register/', auth_views.RegisterView.as_view(), name='register'),
    path('auth/login/', auth_views.LoginView.as_view(), name='login'),
    path('auth/user/', auth_views.UserView.as_view(), name='user'),

    path('admin-auth/login/', admin_views.AdminLoginView.as_view(), name='admin-login'),
    path('admin-auth/stats/', admin_views.AdminStatsView.as_view(), name='admin-stats'),
    path('admin-auth/logs/', admin_views.AdminLogsView.as_view(), name='admin-logs'),
    path('admin-auth/users/', admin_views.AdminUsersView.as_view(), name='admin-users'),
    path('admin-auth/users/<int:user_id>/block/', admin_views.AdminUserBlockView.as_view(), name='admin-user-block'),
    path('admin-auth/users/<int:user_id>/unblock/', admin_views.AdminUserUnblockView.as_view(), name='admin-user-unblock'),
    path('admin-auth/users/<int:user_id>/delete/', admin_views.AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin-auth/downloads/', admin_views.AdminDownloadsView.as_view(), name='admin-downloads'),
    path('admin-auth/security/scan/', admin_views.AdminSecurityScanView.as_view(), name='admin-security-scan'),
    path('admin-auth/threats/', admin_views.AdminThreatsView.as_view(), name='admin-threats'),
    path('admin-auth/threats/resolve/', admin_views.AdminThreatsResolveView.as_view(), name='admin-threats-resolve'),
    path('admin-auth/blocked-ips/', admin_views.AdminBlockedIPsView.as_view(), name='admin-blocked-ips'),
    path('admin-auth/blocked-ips/<int:ip_id>/', admin_views.AdminBlockedIPDeleteView.as_view(), name='admin-blocked-ip-delete'),

    path('admin-auth/designs/', admin_views.AdminDesignListView.as_view(), name='admin-design-list'),
    path('admin-auth/designs/create/', admin_views.AdminDesignCreateView.as_view(), name='admin-design-create'),
    path('admin-auth/designs/<int:pk>/update/', admin_views.AdminDesignUpdateView.as_view(), name='admin-design-update'),
    path('admin-auth/designs/<int:pk>/delete/', admin_views.AdminDesignDeleteView.as_view(), name='admin-design-delete'),

    path('originkit/', views.OriginkitListView.as_view(), name='originkit-list'),
    path('originkit/<str:name>/', views.OriginkitDetailView.as_view(), name='originkit-detail'),
]
