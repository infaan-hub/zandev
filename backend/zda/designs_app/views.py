from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from .models import (Design, ActivityLog, Category, ContactMessage, Collection,
    CollectionDesign, DesignVersion, Review, DesignRemix, Webhook, WebhookDelivery,
    AnalyticsEvent, AdminAuditLog, UserDownload)


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class HealthView(APIView):
    def get(self, request):
        result = {'status': 'ok', 'database': False, 'design_count': 0}
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            result['database'] = True
        except Exception as e:
            result['db_error'] = str(e)
        try:
            result['design_count'] = Design.objects.count()
        except Exception:
            pass
        return Response(result)


class DesignListView(APIView):
    def get(self, request):
        try:
            framework = request.query_params.get('framework')
            category = request.query_params.get('category')
            price = request.query_params.get('price')
            search = request.query_params.get('search')
            sort = request.query_params.get('sort', '-score')
            min_score = request.query_params.get('min_score')
            max_score = request.query_params.get('max_score')
            has_code = request.query_params.get('has_code')

            qs = Design.objects.all()

            if framework:
                qs = qs.filter(framework__iexact=framework)
            if category:
                qs = qs.filter(category__iexact=category)
            if price:
                qs = qs.filter(price__iexact=price)
            if search:
                qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search) | Q(category__icontains=search))
            if min_score:
                qs = qs.filter(score__gte=int(min_score))
            if max_score:
                qs = qs.filter(score__lte=int(max_score))
            if has_code == 'true':
                qs = qs.filter(Q(html_code__isnull=False) | Q(css_code__isnull=False) | Q(js_code__isnull=False))
                qs = qs.exclude(html_code='', css_code='', js_code='')

            valid_sorts = {
                'score': 'score', '-score': '-score',
                'views': 'views', '-views': '-views',
                'exports': 'exports', '-exports': '-exports',
                'name': 'name', '-name': '-name',
                '-created_at': '-created_at', 'created_at': 'created_at',
            }
            order = valid_sorts.get(sort, '-score')
            qs = qs.order_by(order)

            qs = qs.annotate(review_count=Count('reviews'), avg_rating=Avg('reviews__rating'))

            paginator = StandardPagination()
            page = paginator.paginate_queryset(qs, request)

            results = []
            for d in page:
                results.append({
                    'id': d.id,
                    'name': d.name,
                    'category': d.category,
                    'framework': d.framework,
                    'price': d.price,
                    'score': d.score,
                    'views': d.views,
                    'exports': d.exports,
                    'preview': d.get_preview_url(),
                    'file_type': d.file_type,
                    'description': d.description,
                    'html_code': d.html_code,
                    'css_code': d.css_code,
                    'js_code': d.js_code,
                    'has_code': bool(d.html_code or d.css_code or d.js_code or d.code),
                    'review_count': d.review_count,
                    'avg_rating': d.avg_rating,
                })

            return paginator.get_paginated_response(results)
        except Exception as e:
            return Response({'error': str(e), 'results': [], 'count': 0}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DesignDetailView(APIView):
    def get(self, request, pk=None):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)

        AnalyticsEvent.objects.create(
            event_type='design_view',
            design=d,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
        )
        d.views += 1
        d.save(update_fields=['views'])

        reviews = d.reviews.select_related('user').all()[:10]
        return Response({
            'id': d.id,
            'name': d.name,
            'category': d.category,
            'framework': d.framework,
            'price': d.price,
            'score': d.score,
            'views': d.views,
            'exports': d.exports,
            'preview': d.get_preview_url(),
            'file_type': d.file_type,
            'description': d.description,
            'html_code': d.html_code,
            'css_code': d.css_code,
            'js_code': d.js_code,
            'code': d.code,
            'has_code': bool(d.html_code or d.css_code or d.js_code or d.code),
            'review_count': d.reviews.count(),
            'avg_rating': d.reviews.aggregate(avg=Avg('rating'))['avg'],
            'reviews': [{
                'id': r.id,
                'user': r.user.username,
                'rating': r.rating,
                'comment': r.comment,
                'created_at': r.created_at.isoformat(),
            } for r in reviews],
            'created_at': d.created_at.isoformat(),
        }, status=status.HTTP_200_OK)


class DesignExportView(APIView):
    def post(self, request, pk=None):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)

        d.exports += 1
        d.save(update_fields=['exports'])

        AnalyticsEvent.objects.create(
            event_type='design_export',
            design=d,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR'),
        )

        code = d.code
        html = d.html_code
        css = d.css_code
        js = d.js_code

        if not code and not html and not css and not js:
            code = f"// {d.name} - No code provided"

        return Response({
            'code': code.strip() if code else '',
            'html': html,
            'css': css,
            'js': js,
            'design_id': d.id,
        }, status=status.HTTP_200_OK)


class CompareDesignsView(APIView):
    def get(self, request):
        ids = request.query_params.get('ids', '')
        if not ids:
            return Response({'error': 'Provide design IDs'}, status=status.HTTP_400_BAD_REQUEST)
        id_list = [int(x) for x in ids.split(',') if x.strip().isdigit()][:5]
        designs = Design.objects.filter(id__in=id_list)
        data = [{
            'id': d.id, 'name': d.name, 'category': d.category, 'framework': d.framework,
            'score': d.score, 'views': d.views, 'exports': d.exports,
            'html_code': d.html_code, 'css_code': d.css_code, 'js_code': d.js_code,
            'has_code': bool(d.html_code or d.css_code or d.js_code),
            'review_count': d.reviews.count(),
            'avg_rating': d.reviews.aggregate(avg=Avg('rating'))['avg'],
        } for d in designs]
        return Response({'designs': data})


class StatsView(APIView):
    def get(self, request):
        try:
            agg = Design.objects.aggregate(
                total_designs=Count('id'),
                total_views=Sum('views'),
                total_exports=Sum('exports'),
            )
            frameworks = list(Design.objects.values_list('framework', flat=True).distinct())
            categories = list(Design.objects.values_list('category', flat=True).distinct())
            return Response({
                'total_designs': agg['total_designs'] or 0,
                'total_views': agg['total_views'] or 0,
                'total_exports': agg['total_exports'] or 0,
                'frameworks': frameworks,
                'categories': categories,
            })
        except Exception as e:
            return Response({'error': str(e), 'total_designs': 0, 'total_views': 0, 'total_exports': 0}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryListView(APIView):
    def get(self, request):
        cats = Category.objects.filter(is_active=True)
        data = [{'id': c.id, 'name': c.name, 'slug': c.slug, 'description': c.description, 'icon': c.icon, 'design_count': Design.objects.filter(category=c.name).count()} for c in cats]
        return Response({'categories': data})


class ContactMessageView(APIView):
    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        message = request.data.get('message', '').strip()
        subject = request.data.get('subject', 'General Inquiry').strip()
        if not name or not email or not message:
            return Response({'error': 'Name, email, and message are required'}, status=status.HTTP_400_BAD_REQUEST)
        ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
        return Response({'success': True, 'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)


class CollectionListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        collections = Collection.objects.filter(user=request.user)
        data = [{
            'id': c.id, 'name': c.name, 'description': c.description,
            'is_public': c.is_public, 'design_count': c.design_count,
            'created_at': c.created_at.isoformat(),
            'designs': [{'id': cd.design.id, 'name': cd.design.name, 'preview': cd.design.get_preview_url()} for cd in c.designs.select_related('design')[:20]],
        } for c in collections]
        return Response({'collections': data})

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)
        c = Collection.objects.create(user=request.user, name=name, description=request.data.get('description', ''), is_public=request.data.get('is_public', False))
        return Response({'id': c.id, 'name': c.name, 'success': True}, status=status.HTTP_201_CREATED)


class CollectionDetailView(APIView):
    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            c = Collection.objects.get(id=pk, user=request.user)
        except Collection.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        c.delete()
        return Response({'success': True})

    def post(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            c = Collection.objects.get(id=pk, user=request.user)
        except Collection.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        design_id = request.data.get('design_id')
        action = request.data.get('action', 'add')
        if action == 'add' and design_id:
            design = Design.objects.filter(id=design_id).first()
            if design:
                obj, created = CollectionDesign.objects.get_or_create(collection=c, design=design)
                if created:
                    c.design_count = c.designs.count()
                    c.save(update_fields=['design_count'])
        elif action == 'remove' and design_id:
            CollectionDesign.objects.filter(collection=c, design_id=design_id).delete()
            c.design_count = c.designs.count()
            c.save(update_fields=['design_count'])
        return Response({'success': True, 'design_count': c.design_count})


class ReviewListView(APIView):
    def get(self, request, design_id):
        try:
            design = Design.objects.get(id=design_id)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        reviews = Review.objects.filter(design=design).select_related('user')[:50]
        data = [{
            'id': r.id, 'user': r.user.username, 'rating': r.rating,
            'comment': r.comment, 'created_at': r.created_at.isoformat(),
        } for r in reviews]
        avg = Review.objects.filter(design=design).aggregate(avg=Avg('rating'))['avg']
        return Response({'reviews': data, 'avg_rating': avg, 'count': Review.objects.filter(design=design).count()})

    def post(self, request, design_id):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            design = Design.objects.get(id=design_id)
        except Design.DoesNotExist:
            return Response({'error': 'Design not found'}, status=status.HTTP_404_NOT_FOUND)
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')
        if not rating or not (1 <= int(rating) <= 5):
            return Response({'error': 'Rating 1-5 required'}, status=status.HTTP_400_BAD_REQUEST)
        if Review.objects.filter(user=request.user, design=design).exists():
            return Response({'error': 'Already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
        r = Review.objects.create(user=request.user, design=design, rating=int(rating), comment=comment)
        return Response({'id': r.id, 'success': True}, status=status.HTTP_201_CREATED)


class RemixListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        remixes = DesignRemix.objects.filter(user=request.user).select_related('parent_design', 'remix_design')[:50]
        data = [{
            'id': r.id,
            'parent': {'id': r.parent_design.id, 'name': r.parent_design.name},
            'remix': {'id': r.remix_design.id, 'name': r.remix_design.name},
            'created_at': r.created_at.isoformat(),
        } for r in remixes]
        return Response({'remixes': data})


class WebhookListView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        webhooks = Webhook.objects.filter(user=request.user)
        data = [{
            'id': w.id, 'url': w.url, 'events': w.events,
            'is_active': w.is_active, 'created_at': w.created_at.isoformat(),
        } for w in webhooks]
        return Response({'webhooks': data})

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        url = request.data.get('url', '').strip()
        events = request.data.get('events', [])
        if not url:
            return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
        import secrets
        w = Webhook.objects.create(user=request.user, url=url, events=events, secret=secrets.token_hex(32))
        return Response({'id': w.id, 'secret': w.secret, 'success': True}, status=status.HTTP_201_CREATED)


class WebhookDeleteView(APIView):
    def delete(self, request, pk):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            w = Webhook.objects.get(id=pk, user=request.user)
        except Webhook.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        w.delete()
        return Response({'success': True})


class AnalyticsDashboardView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        now = timezone.now()
        days_30 = now - timedelta(days=30)
        days_7 = now - timedelta(days=7)

        views_by_day = []
        for i in range(30):
            day = (now - timedelta(days=29-i)).date()
            count = AnalyticsEvent.objects.filter(event_type='design_view', created_at__date=day).count()
            views_by_day.append({'date': day.isoformat(), 'count': count})

        top_designs = Design.objects.order_by('-views')[:10].values('id', 'name', 'views', 'exports')

        total_views = AnalyticsEvent.objects.filter(event_type='design_view', created_at__gte=days_30).count()
        total_exports = AnalyticsEvent.objects.filter(event_type='design_export', created_at__gte=days_30).count()
        total_signups = AnalyticsEvent.objects.filter(event_type='signup', created_at__gte=days_30).count()
        total_searches = AnalyticsEvent.objects.filter(event_type='search', created_at__gte=days_30).count()

        return Response({
            'views_by_day': views_by_day,
            'top_designs': list(top_designs),
            'total_views_30d': total_views,
            'total_exports_30d': total_exports,
            'total_signups_30d': total_signups,
            'total_searches_30d': total_searches,
        })


class UserDownloadsView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        downloads = UserDownload.objects.filter(user=request.user).select_related('design').order_by('-downloaded_at')
        results = []
        for d in downloads:
            results.append({
                'id': d.id,
                'design_id': d.design.id if d.design else None,
                'design_name': d.design.name if d.design else 'Unknown',
                'framework': d.design.framework if d.design else '',
                'downloaded_at': d.downloaded_at.isoformat(),
                'download_type': d.download_type,
            })
        return Response({'results': results, 'count': len(results)})
