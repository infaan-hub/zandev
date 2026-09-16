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
from .models import (ActivityLog, BlockedIP, ThreatAlert, UserDownload, Design,
    AdminAuditLog, ContactMessage, Category, DesignVersion, Review, PricingPlan)

try:
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    def broadcast_design_update(design_id, action, design_data=None):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'designs',
            {
                'type': 'design_updated',
                'design': design_data or {'id': design_id},
                'action': action,
            }
        )
except (ImportError, Exception):
    def broadcast_design_update(design_id, action, design_data=None):
        pass

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']


def log_activity(action, detail='', user=None, ip=None, ua=''):
    username = user.username if user else ADMIN_USERNAME
    ActivityLog.objects.create(user=user, username=username, action=action, detail=detail, ip_address=ip, user_agent=ua)


def audit_log(admin_user, action, target_type='', target_id=None, details=None, ip=None):
    AdminAuditLog.objects.create(admin_user=admin_user, action=action, target_type=target_type, target_id=target_id, details=details or {}, ip_address=ip)


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

        days_30 = now - timedelta(days=30)
        views_by_day = []
        for i in range(30):
            day = (now - timedelta(days=29-i)).date()
            count = Design.objects.filter(updated_at__date=day).count() + ActivityLog.objects.filter(timestamp__date=day).count()
            views_by_day.append({'date': day.isoformat(), 'count': count})

        users_by_day = []
        for i in range(30):
            day = (now - timedelta(days=29-i)).date()
            count = User.objects.filter(date_joined__date=day).count()
            users_by_day.append({'date': day.isoformat(), 'count': count})

        return Response({
            'total_users': total_users,
            'recent_logins_24h': recent_logins,
            'total_exports': total_exports,
            'blocked_ips': blocked_ips,
            'active_threats': threats,
            'logs_48h': logs_48h,
            'downloads': downloads,
            'total_designs': total_designs,
            'views_by_day': views_by_day,
            'users_by_day': users_by_day,
        })


class AdminLogsView(APIView):
    def get(self, request):
        cleanup_old_logs()
        logs = ActivityLog.objects.all()[:200]
        data = [{
            'id': l.id, 'username': l.username, 'action': l.action,
            'detail': l.detail, 'ip_address': l.ip_address or '',
            'user_agent': l.user_agent[:80], 'timestamp': l.timestamp.isoformat(),
        } for l in logs]
        return Response({'logs': data})


class AdminAuditLogsView(APIView):
    def get(self, request):
        logs = AdminAuditLog.objects.all()[:200]
        data = [{
            'id': l.id, 'admin': l.admin_user.username if l.admin_user else '',
            'action': l.action, 'target_type': l.target_type,
            'target_id': l.target_id, 'details': l.details,
            'ip_address': l.ip_address or '', 'created_at': l.created_at.isoformat(),
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
                'id': u.id, 'username': u.username, 'email': u.email,
                'name': u.first_name, 'is_active': u.is_active,
                'is_staff': u.is_staff, 'is_superuser': u.is_superuser,
                'date_joined': u.date_joined.isoformat(),
                'last_login': u.last_login.isoformat() if u.last_login else None,
                'downloads': downloads,
                'last_seen': last_login_log.timestamp.isoformat() if last_login_log else None,
            })
        return Response({'users': data})


class AdminUserUpdateView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if 'is_staff' in request.data:
            user.is_staff = request.data['is_staff']
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
        user.save()
        audit_log(request.user, 'update_user', 'user', user.id, {'is_staff': user.is_staff, 'is_active': user.is_active}, _get_ip(request))
        return Response({'success': True})


class AdminUserBlockView(APIView):
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = False
        user.save()
        log_activity('block', f'Blocked user: {user.username}', ip=_get_ip(request))
        audit_log(request.user, 'block_user', 'user', user.id, ip=_get_ip(request))
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
        audit_log(request.user, 'unblock_user', 'user', user.id, ip=_get_ip(request))
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
        audit_log(request.user, 'delete_user', 'user', user_id, {'username': username}, _get_ip(request))
        return Response({'success': True})


class AdminDownloadsView(APIView):
    def get(self, request):
        downloads = UserDownload.objects.all()[:100]
        data = [{
            'id': d.id, 'user': d.user.username,
            'design_name': d.design_name, 'design_id': d.design_id,
            'downloaded_at': d.downloaded_at.isoformat(),
        } for d in downloads]
        return Response({'downloads': data})


class AdminSecurityScanView(APIView):
    def post(self, request):
        threats_found = []
        scan_results = _run_security_scan()
        for threat in scan_results:
            t = ThreatAlert.objects.create(
                threat_type=threat['type'], description=threat['description'],
                severity=threat['severity'], ip_address=threat.get('ip'),
                blocked=threat.get('auto_block', False),
            )
            if threat.get('auto_block') and threat.get('ip'):
                BlockedIP.objects.get_or_create(ip_address=threat['ip'], defaults={'reason': threat['description']})
            threats_found.append({'id': t.id, 'type': t.threat_type, 'description': t.description, 'severity': t.severity, 'blocked': t.blocked})
        log_activity('scan', f'Security scan completed. {len(threats_found)} threats found.', ip=_get_ip(request))
        audit_log(request.user, 'security_scan', details={'threats_found': len(threats_found)}, ip=_get_ip(request))
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
        except ThreatAlert.DoesNotExist:
            return Response({'error': 'Threat not found'}, status=status.HTTP_404_NOT_FOUND)
        threat.resolved = True
        threat.save()
        audit_log(request.user, 'resolve_threat', 'threat', threat.id, ip=_get_ip(request))
        return Response({'success': True})


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
            obj, created = BlockedIP.objects.get_or_create(ip_address=ip, defaults={'reason': reason})
            audit_log(request.user, 'block_ip', 'ip', obj.id, {'ip': ip, 'reason': reason}, _get_ip(request))
            return Response({'success': True, 'created': created})
        return Response({'error': 'IP required'}, status=status.HTTP_400_BAD_REQUEST)


class AdminBlockedIPDeleteView(APIView):
    def delete(self, request, ip_id):
        try:
            ip = BlockedIP.objects.get(id=ip_id)
        except BlockedIP.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        audit_log(request.user, 'unblock_ip', 'ip', ip.id, {'ip': ip.ip_address}, _get_ip(request))
        ip.delete()
        return Response({'success': True})


class AdminContactMessagesView(APIView):
    def get(self, request):
        messages = ContactMessage.objects.all()[:100]
        data = [{
            'id': m.id, 'name': m.name, 'email': m.email,
            'subject': m.subject, 'message': m.message,
            'is_read': m.is_read, 'created_at': m.created_at.isoformat(),
        } for m in messages]
        return Response({'messages': data})

    def post(self, request):
        msg_id = request.data.get('id')
        try:
            m = ContactMessage.objects.get(id=msg_id)
            m.is_read = True
            m.save(update_fields=['is_read'])
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True})


class AdminBulkDesignsView(APIView):
    def post(self, request):
        action = request.data.get('action')
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No design IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        designs = Design.objects.filter(id__in=ids)

        if action == 'delete':
            count = designs.count()
            designs.delete()
            audit_log(request.user, 'bulk_delete_designs', 'design', details={'count': count, 'ids': ids}, ip=_get_ip(request))
            return Response({'success': True, 'deleted': count})
        elif action == 'set_category':
            category = request.data.get('category', '')
            designs.update(category=category)
            audit_log(request.user, 'bulk_update_category', 'design', details={'count': designs.count(), 'category': category}, ip=_get_ip(request))
            return Response({'success': True, 'updated': designs.count()})
        elif action == 'set_price':
            price = request.data.get('price', '')
            designs.update(price=price)
            audit_log(request.user, 'bulk_update_price', 'design', details={'count': designs.count(), 'price': price}, ip=_get_ip(request))
            return Response({'success': True, 'updated': designs.count()})

        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)


def _abs_url(path):
    if not path:
        return ''
    if path.startswith('http://') or path.startswith('https://'):
        return path
    base = os.environ.get('BACKEND_URL', 'https://zandev.onrender.com')
    return base + path


def _design_to_dict(d):
    gallery = [_abs_url(img) for img in (d.gallery_images or []) if img]
    if not gallery:
        gallery = [_abs_url(d.gallery_image_1), _abs_url(d.gallery_image_2),
                   _abs_url(d.gallery_image_3), _abs_url(d.gallery_image_4),
                   _abs_url(d.gallery_image_5)]
        gallery = [img for img in gallery if img]
    return {
        'id': d.id, 'name': d.name, 'category': d.category,
        'framework': d.framework, 'price': d.price, 'score': d.score,
        'views': d.views, 'exports': d.exports,
        'description': d.description, 'prompt': d.prompt,
        'preview_image': _abs_url(d.preview_image) or _abs_url(d.get_preview_url()), 'preview': _abs_url(d.get_preview_url()),
        'gallery_images': gallery,
        'gallery_image_1': _abs_url(d.gallery_image_1), 'gallery_image_2': _abs_url(d.gallery_image_2),
        'gallery_image_3': _abs_url(d.gallery_image_3), 'gallery_image_4': _abs_url(d.gallery_image_4),
        'gallery_image_5': _abs_url(d.gallery_image_5),
        'file_type': d.file_type, 'code': d.code,
        'html_code': d.html_code, 'css_code': d.css_code, 'js_code': d.js_code,
        'react_code': d.react_code, 'vue_code': d.vue_code,
        'svelte_code': d.svelte_code, 'astro_code': d.astro_code,
        'next_code': d.next_code,
        'version': d.version, 'published': d.published,
        'style': d.style, 'industry': d.industry, 'tags': d.tags,
        'colors': d.colors, 'typography': d.typography,
        'animations': d.animations, 'layout_type': d.layout_type,
        'responsive': d.responsive, 'accessibility': d.accessibility,
        'browser_support': d.browser_support, 'license': d.license,
        'difficulty': d.difficulty, 'creator': d.creator, 'pricing': d.pricing,
        'created_at': d.created_at.isoformat(), 'updated_at': d.updated_at.isoformat(),
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
            prompt=request.data.get('prompt', ''),
            preview_image=request.data.get('preview_image', ''),
            gallery_image_1=request.data.get('gallery_image_1', ''),
            gallery_image_2=request.data.get('gallery_image_2', ''),
            gallery_image_3=request.data.get('gallery_image_3', ''),
            gallery_image_4=request.data.get('gallery_image_4', ''),
            gallery_image_5=request.data.get('gallery_image_5', ''),
            code=request.data.get('code', ''),
            html_code=request.data.get('html_code', ''),
            css_code=request.data.get('css_code', ''),
            js_code=request.data.get('js_code', ''),
            react_code=request.data.get('react_code', ''),
            vue_code=request.data.get('vue_code', ''),
            svelte_code=request.data.get('svelte_code', ''),
            astro_code=request.data.get('astro_code', ''),
            next_code=request.data.get('next_code', ''),
            published=request.data.get('published', 'true').lower() == 'true',
        )
        front = request.FILES.get('front_image')
        if front:
            d.uploaded_file = front
            d.file_type = _detect_file_type(front.name)
        elif d.preview_image:
            d.file_type = 'url'
        for i in range(1, 6):
            f = request.FILES.get(f'gallery_image_{i}_file')
            if f:
                setattr(d, f'gallery_image_{i}', f.url if hasattr(f, 'url') else '')
        d.save()
        for i in range(1, 6):
            f = request.FILES.get(f'gallery_image_{i}_file')
            if f:
                setattr(d, f'gallery_image_{i}', f'/media/designs/gallery/{d.id}_{i}_{f.name}')
                from django.core.files.storage import default_storage
                import os
                path = os.path.join('designs', 'gallery', f'{d.id}_{i}_{f.name}')
                default_storage.save(path, f)
                setattr(d, f'gallery_image_{i}', f'/media/{path}')
        d.save(update_fields=['gallery_image_1', 'gallery_image_2', 'gallery_image_3', 'gallery_image_4', 'gallery_image_5', 'uploaded_file', 'file_type'])
        log_activity('export', f'Created design: {d.name}', ip=_get_ip(request))
        audit_log(request.user, 'create_design', 'design', d.id, {'name': d.name}, _get_ip(request))
        broadcast_design_update(d.id, 'create', _design_to_dict(d))
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
        d.prompt = request.data.get('prompt', d.prompt)
        d.code = request.data.get('code', d.code)
        d.html_code = request.data.get('html_code', d.html_code)
        d.css_code = request.data.get('css_code', d.css_code)
        d.js_code = request.data.get('js_code', d.js_code)
        d.react_code = request.data.get('react_code', d.react_code)
        d.vue_code = request.data.get('vue_code', d.vue_code)
        d.svelte_code = request.data.get('svelte_code', d.svelte_code)
        d.astro_code = request.data.get('astro_code', d.astro_code)
        d.next_code = request.data.get('next_code', d.next_code)
        if 'published' in request.data:
            d.published = request.data.get('published', d.published)
        front = request.FILES.get('front_image')
        if front:
            if d.uploaded_file:
                try:
                    import os
                    os.remove(d.uploaded_file.path)
                except OSError:
                    pass
            d.uploaded_file = front
            d.file_type = _detect_file_type(front.name)
        from django.core.files.storage import default_storage
        import os
        for i in range(1, 6):
            f = request.FILES.get(f'gallery_image_{i}_file')
            if f:
                old = getattr(d, f'gallery_image_{i}')
                if old and old.startswith('/media/'):
                    try:
                        default_storage.delete(old.replace('/media/', ''))
                    except Exception:
                        pass
                path = os.path.join('designs', 'gallery', f'{d.id}_{i}_{f.name}')
                default_storage.save(path, f)
                setattr(d, f'gallery_image_{i}', f'/media/{path}')
        d.version += 1
        d.save()

        DesignVersion.objects.create(
            design=d, version_number=d.version,
            html_code=d.html_code, css_code=d.css_code, js_code=d.js_code,
            changelog=request.data.get('changelog', ''),
            created_by=request.user if request.user.is_authenticated else None,
        )

        audit_log(request.user, 'update_design', 'design', d.id, {'name': d.name}, _get_ip(request))
        broadcast_design_update(d.id, 'update', _design_to_dict(d))
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
        audit_log(request.user, 'delete_design', 'design', pk, {'name': name}, _get_ip(request))
        broadcast_design_update(pk, 'delete', {'id': pk, 'name': name})
        return Response({'success': True})


class AdminDesignVersionsView(APIView):
    def get(self, request, pk):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        versions = d.versions.all()[:50]
        data = [{
            'id': v.id, 'version_number': v.version_number,
            'changelog': v.changelog, 'created_by': v.created_by.username if v.created_by else '',
            'created_at': v.created_at.isoformat(),
        } for v in versions]
        return Response({'versions': data})


class AdminDesignPublishView(APIView):
    def post(self, request, pk):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        d.published = True
        d.save(update_fields=['published', 'updated_at'])
        broadcast_design_update(d.id, 'publish', _design_to_dict(d))
        return Response(_design_to_dict(d))


class AdminDesignUnpublishView(APIView):
    def post(self, request, pk):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        d.published = False
        d.save(update_fields=['published', 'updated_at'])
        broadcast_design_update(d.id, 'unpublish', _design_to_dict(d))
        return Response(_design_to_dict(d))


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


class AdminPricingPlanListView(APIView):
    def get(self, request):
        plans = PricingPlan.objects.all()
        data = [{
            'id': p.id,
            'name': p.name,
            'slug': p.slug,
            'price': str(p.price),
            'period': p.period,
            'description': p.description,
            'features': p.features,
            'design_limit': p.design_limit,
            'is_popular': p.is_popular,
            'is_active': p.is_active,
            'order': p.order,
            'created_at': p.created_at.isoformat(),
        } for p in plans]
        return Response(data)

    def post(self, request):
        name = request.data.get('name', '')
        slug = request.data.get('slug', '') or slugify(name)
        price = request.data.get('price', 0)
        period = request.data.get('period', 'month')
        description = request.data.get('description', '')
        features = request.data.get('features', [])
        design_limit = request.data.get('design_limit', 0)
        is_popular = request.data.get('is_popular', False)
        is_active = request.data.get('is_active', True)
        order = request.data.get('order', 0)

        if not name:
            return Response({'error': 'Name required'}, status=status.HTTP_400_BAD_REQUEST)

        plan = PricingPlan.objects.create(
            name=name, slug=slug, price=price, period=period,
            description=description, features=features, design_limit=design_limit,
            is_popular=is_popular, is_active=is_active, order=order,
        )
        return Response({
            'id': plan.id, 'name': plan.name, 'slug': plan.slug,
            'price': str(plan.price), 'period': plan.period,
            'description': plan.description, 'features': plan.features,
            'design_limit': plan.design_limit, 'is_popular': plan.is_popular,
            'is_active': plan.is_active, 'order': plan.order,
        })


class AdminPricingPlanDetailView(APIView):
    def get(self, request, pk):
        try:
            plan = PricingPlan.objects.get(id=pk)
        except PricingPlan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'id': plan.id, 'name': plan.name, 'slug': plan.slug,
            'price': str(plan.price), 'period': plan.period,
            'description': plan.description, 'features': plan.features,
            'design_limit': plan.design_limit, 'is_popular': plan.is_popular,
            'is_active': plan.is_active, 'order': plan.order,
        })

    def put(self, request, pk):
        try:
            plan = PricingPlan.objects.get(id=pk)
        except PricingPlan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
        for field in ['name', 'slug', 'price', 'period', 'description', 'features', 'design_limit', 'is_popular', 'is_active', 'order']:
            if field in request.data:
                setattr(plan, field, request.data[field])
        if 'name' in request.data and 'slug' not in request.data:
            plan.slug = slugify(request.data['name'])
        plan.save()
        return Response({
            'id': plan.id, 'name': plan.name, 'slug': plan.slug,
            'price': str(plan.price), 'period': plan.period,
            'description': plan.description, 'features': plan.features,
            'design_limit': plan.design_limit, 'is_popular': plan.is_popular,
            'is_active': plan.is_active, 'order': plan.order,
        })

    def delete(self, request, pk):
        try:
            plan = PricingPlan.objects.get(id=pk)
        except PricingPlan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
        plan.delete()
        return Response({'success': True})
