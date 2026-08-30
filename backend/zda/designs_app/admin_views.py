import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.text import slugify
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import ActivityLog, BlockedIP, ThreatAlert, UserDownload, Design

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']


def log_activity(action, detail='', user=None, ip=None, ua=''):
    username = user.username if user else ADMIN_USERNAME
    ActivityLog.objects.create(
        user=user,
        username=username,
        action=action,
        detail=detail,
        ip_address=ip,
        user_agent=ua,
    )


def cleanup_old_logs():
    cutoff = timezone.now() - timedelta(hours=48)
    ActivityLog.objects.filter(timestamp__lt=cutoff).delete()


def _get_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')


def _detect_file_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext in VIDEO_EXTENSIONS:
        return 'video'
    if ext in IMAGE_EXTENSIONS:
        return 'image'
    return 'url'


class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            log_activity('login', 'Admin logged in via admin panel', ip=_get_ip(request), ua=request.META.get('HTTP_USER_AGENT', ''))
            return Response({'success': True, 'role': 'admin'})

        user = authenticate(username=username, password=password)
        if user and (user.is_staff or user.is_superuser):
            log_activity('login', f'Superuser logged in: {user.username}', ip=_get_ip(request), ua=request.META.get('HTTP_USER_AGENT', ''))
            return Response({'success': True, 'role': 'admin'})

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class AdminStatsView(APIView):
    def get(self, request):
        cleanup_old_logs()
        now = timezone.now()
        total_users = User.objects.count()
        recent_logins = ActivityLog.objects.filter(action='login', timestamp__gte=now - timedelta(hours=24)).count()
        total_exports = ActivityLog.objects.filter(action='export').count()
        blocked_ips = BlockedIP.objects.filter(is_active=True).count()
        threats = ThreatAlert.objects.filter(resolved=False).count()
        logs_48h = ActivityLog.objects.filter(timestamp__gte=now - timedelta(hours=48)).count()
        downloads = UserDownload.objects.count()
        total_designs = Design.objects.count()
        return Response({
            'total_users': total_users,
            'recent_logins_24h': recent_logins,
            'total_exports': total_exports,
            'blocked_ips': blocked_ips,
            'active_threats': threats,
            'logs_48h': logs_48h,
            'total_downloads': downloads,
            'total_designs': total_designs,
        })


class AdminLogsView(APIView):
    def get(self, request):
        cleanup_old_logs()
        logs = ActivityLog.objects.all()[:200]
        data = [{
            'id': l.id,
            'username': l.username,
            'action': l.action,
            'detail': l.detail,
            'ip_address': l.ip_address or '',
            'user_agent': l.user_agent[:80],
            'timestamp': l.timestamp.isoformat(),
        } for l in logs]
        return Response({'logs': data})


class AdminUsersView(APIView):
    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        data = []
        for u in users:
            downloads = UserDownload.objects.filter(user=u).count()
            last_login_log = ActivityLog.objects.filter(user=u, action='login').first()
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'name': u.first_name,
                'is_active': u.is_active,
                'is_staff': u.is_staff,
                'date_joined': u.date_joined.isoformat(),
                'last_login': u.last_login.isoformat() if u.last_login else None,
                'downloads': downloads,
                'last_seen': last_login_log.timestamp.isoformat() if last_login_log else None,
            })
        return Response({'users': data})


class AdminUserBlockView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = False
        user.save()
        log_activity('block', f'Blocked user: {user.username}', ip=_get_ip(request))
        return Response({'success': True})


class AdminUserUnblockView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = True
        user.save()
        log_activity('unblock', f'Unblocked user: {user.username}', ip=_get_ip(request))
        return Response({'success': True})


class AdminUserDeleteView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        username = user.username
        user.delete()
        log_activity('delete_user', f'Deleted user: {username}', ip=_get_ip(request))
        return Response({'success': True})


class AdminDownloadsView(APIView):
    def get(self, request):
        downloads = UserDownload.objects.all()[:100]
        data = [{
            'id': d.id,
            'user': d.user.username,
            'design_name': d.design_name,
            'design_id': d.design_id,
            'downloaded_at': d.downloaded_at.isoformat(),
        } for d in downloads]
        return Response({'downloads': data})


class AdminSecurityScanView(APIView):
    def post(self, request):
        threats_found = []
        scan_results = _run_security_scan()
        for threat in scan_results:
            t = ThreatAlert.objects.create(
                threat_type=threat['type'],
                description=threat['description'],
                severity=threat['severity'],
                ip_address=threat.get('ip'),
                blocked=threat.get('auto_block', False),
            )
            if threat.get('auto_block') and threat.get('ip'):
                BlockedIP.objects.get_or_create(
                    ip_address=threat['ip'],
                    defaults={'reason': threat['description']},
                )
            threats_found.append({
                'id': t.id, 'type': t.threat_type, 'description': t.description,
                'severity': t.severity, 'blocked': t.blocked,
            })
        log_activity('scan', f'Security scan completed. {len(threats_found)} threats found.', ip=_get_ip(request))
        return Response({'scan_complete': True, 'threats_found': len(threats_found), 'threats': threats_found})


class AdminThreatsView(APIView):
    def get(self, request):
        threats = ThreatAlert.objects.all()[:100]
        data = [{
            'id': t.id, 'type': t.threat_type, 'description': t.description,
            'severity': t.severity, 'ip_address': t.ip_address or '',
            'blocked': t.blocked, 'resolved': t.resolved,
            'detected_at': t.detected_at.isoformat(),
        } for t in threats]
        return Response({'threats': data})


class AdminThreatsResolveView(APIView):
    def post(self, request):
        threat_id = request.data.get('threat_id')
        try:
            threat = ThreatAlert.objects.get(id=threat_id)
            threat.resolved = True
            threat.save()
            return Response({'success': True})
        except ThreatAlert.DoesNotExist:
            return Response({'error': 'Threat not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminBlockedIPsView(APIView):
    def get(self, request):
        ips = BlockedIP.objects.all()
        data = [{
            'id': ip.id, 'ip_address': ip.ip_address, 'reason': ip.reason,
            'blocked_at': ip.blocked_at.isoformat(), 'is_active': ip.is_active,
        } for ip in ips]
        return Response({'blocked_ips': data})

    def post(self, request):
        ip = request.data.get('ip_address', '').strip()
        reason = request.data.get('reason', 'Manually blocked')
        if ip:
            obj, created = BlockedIP.objects.get_or_create(
                ip_address=ip, defaults={'reason': reason},
            )
            return Response({'success': True, 'created': created})
        return Response({'error': 'IP required'}, status=status.HTTP_400_BAD_REQUEST)


class AdminBlockedIPDeleteView(APIView):
    def delete(self, request, ip_id):
        try:
            ip = BlockedIP.objects.get(id=ip_id)
            ip.delete()
            return Response({'success': True})
        except BlockedIP.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


def _design_to_dict(d):
    return {
        'id': d.id,
        'name': d.name,
        'category': d.category,
        'framework': d.framework,
        'price': d.price,
        'score': d.score,
        'views': d.views,
        'exports': d.exports,
        'description': d.description,
        'preview': d.get_preview_url(),
        'file_type': d.file_type,
        'code': d.code,
        'html_code': d.html_code,
        'css_code': d.css_code,
        'js_code': d.js_code,
        'created_at': d.created_at.isoformat(),
    }


class AdminDesignListView(APIView):
    def get(self, request):
        designs = Design.objects.all()
        data = [_design_to_dict(d) for d in designs]
        return Response({'designs': data, 'count': len(data)})


class AdminDesignCreateView(APIView):
    def post(self, request):
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

        d = Design(
            name=name,
            category=request.data.get('category', 'Landing'),
            framework=request.data.get('framework', 'React'),
            price=request.data.get('price', 'Free'),
            score=int(request.data.get('score', 0)),
            description=request.data.get('description', ''),
            preview_image=request.data.get('preview_image', ''),
            code=request.data.get('code', ''),
            html_code=request.data.get('html_code', ''),
            css_code=request.data.get('css_code', ''),
            js_code=request.data.get('js_code', ''),
        )

        uploaded = request.FILES.get('file')
        if uploaded:
            d.uploaded_file = uploaded
            d.file_type = _detect_file_type(uploaded.name)
        elif d.preview_image:
            d.file_type = 'url'

        d.save()
        log_activity('export', f'Created design: {d.name}', ip=_get_ip(request))
        return Response(_design_to_dict(d), status=status.HTTP_201_CREATED)


class AdminDesignUpdateView(APIView):
    def post(self, request, pk):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)

        d.name = request.data.get('name', d.name)
        d.category = request.data.get('category', d.category)
        d.framework = request.data.get('framework', d.framework)
        d.price = request.data.get('price', d.price)
        d.score = int(request.data.get('score', d.score))
        d.description = request.data.get('description', d.description)
        d.preview_image = request.data.get('preview_image', d.preview_image)
        d.code = request.data.get('code', d.code)
        d.html_code = request.data.get('html_code', d.html_code)
        d.css_code = request.data.get('css_code', d.css_code)
        d.js_code = request.data.get('js_code', d.js_code)

        uploaded = request.FILES.get('file')
        if uploaded:
            if d.uploaded_file:
                try:
                    os.remove(d.uploaded_file.path)
                except OSError:
                    pass
            d.uploaded_file = uploaded
            d.file_type = _detect_file_type(uploaded.name)

        d.save()
        return Response(_design_to_dict(d))


class AdminDesignDeleteView(APIView):
    def post(self, request, pk):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        name = d.name
        if d.uploaded_file:
            try:
                os.remove(d.uploaded_file.path)
            except OSError:
                pass
        d.delete()
        log_activity('delete_user', f'Deleted design: {name}', ip=_get_ip(request))
        return Response({'success': True})


def _run_security_scan():
    threats = []
    if not User.objects.filter(is_staff=True).exists():
        threats.append({'type': 'No Admin User', 'description': 'No staff/admin user found.', 'severity': 'medium'})
    inactive = User.objects.filter(is_active=False).count()
    if inactive > 0:
        threats.append({'type': 'Inactive Accounts', 'description': f'{inactive} inactive user(s).', 'severity': 'low'})
    recent = ActivityLog.objects.filter(action='login', timestamp__gte=timezone.now() - timedelta(hours=1)).count()
    if recent > 10:
        threats.append({'type': 'Brute Force', 'description': f'{recent} logins in 1 hour.', 'severity': 'high'})
    blocked = BlockedIP.objects.filter(is_active=True).count()
    if blocked > 5:
        threats.append({'type': 'High Block Count', 'description': f'{blocked} IPs blocked.', 'severity': 'medium'})
    return threats
