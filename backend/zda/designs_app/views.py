from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum
from .models import Design


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

            qs = Design.objects.all()

            if framework:
                qs = qs.filter(framework__iexact=framework)
            if category:
                qs = qs.filter(category__iexact=category)
            if price:
                qs = qs.filter(price__iexact=price)
            if search:
                from django.db.models import Q
                qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))

            valid_sorts = {
                'score': 'score', '-score': '-score',
                'views': 'views', '-views': '-views',
                'exports': 'exports', '-exports': '-exports',
                'name': 'name', '-name': '-name',
                '-created_at': '-created_at', 'created_at': 'created_at',
            }
            order = valid_sorts.get(sort, '-score')
            qs = qs.order_by(order)

            results = []
            for d in qs:
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
                })

            return Response({'count': len(results), 'results': results}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e), 'results': [], 'count': 0}, status=status.HTTP_200_OK)


class DesignDetailView(APIView):
    def get(self, request, pk=None):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)
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
        }, status=status.HTTP_200_OK)


class DesignExportView(APIView):
    def post(self, request, pk=None):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)

        code = d.code
        html = d.html_code
        css = d.css_code
        js = d.js_code

        if not code and not html and not css and not js:
            code = f"""// {d.name} - {d.framework} Component

import React from 'react';

export default function {d.name.replace(' ', '').replace('-', '')}() {{
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <h1 className="text-3xl font-bold mb-4">{d.name}</h1>
      <p className="text-gray-400">No code provided for this design.</p>
    </div>
  );
}}"""

        d.exports += 1
        d.save(update_fields=['exports'])
        return Response({
            'code': code.strip() if code else '',
            'html': html,
            'css': css,
            'js': js,
            'design_id': d.id,
        }, status=status.HTTP_200_OK)


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
            return Response({'error': str(e), 'total_designs': 0, 'total_views': 0, 'total_exports': 0, 'frameworks': [], 'categories': []})
