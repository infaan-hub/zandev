from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum
from .models import Design


class DesignListView(APIView):
    def get(self, request):
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
            qs = qs.filter(name__icontains=search) | qs.filter(description__icontains=search)

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
            })

        return Response({'count': len(results), 'results': results}, status=status.HTTP_200_OK)


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
        }, status=status.HTTP_200_OK)


class DesignExportView(APIView):
    def post(self, request, pk=None):
        try:
            d = Design.objects.get(id=pk)
        except Design.DoesNotExist:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)

        code = d.code
        if not code:
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
        return Response({'code': code.strip(), 'design_id': d.id}, status=status.HTTP_200_OK)


class StatsView(APIView):
    def get(self, request):
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


class OriginkitListView(APIView):
    def get(self, request):
        from .originkit_service import ORIGINKIT_CATALOG, CATEGORY_MAP
        category = request.query_params.get('category')
        search = request.query_params.get('search')

        results = list(ORIGINKIT_CATALOG)

        if category:
            results = [c for c in results if c['category'] == category]
        if search:
            q = search.lower()
            results = [c for c in results if q in c['name'].lower() or q in c['displayName'].lower() or q in c['description'].lower() or any(q in t for t in c['tags'])]

        categories = list({c['category'] for c in ORIGINKIT_CATALOG})
        cat_map = {c: CATEGORY_MAP.get(c, c.replace('-', ' ').title()) for c in categories}

        enriched = []
        for c in results:
            enriched.append({
                **c,
                'displayName': c['displayName'],
                'categoryLabel': cat_map.get(c['category'], c['category']),
                'preview': f"https://placehold.co/600x400/111111/666666?text={c['displayName'].replace(' ', '+')}",
            })

        return Response({
            'count': len(enriched),
            'categories': cat_map,
            'results': enriched,
        }, status=status.HTTP_200_OK)


class OriginkitDetailView(APIView):
    def get(self, request, name=None):
        from .originkit_service import ORIGINKIT_CATALOG, get_originkit_component, CATEGORY_MAP
        match = next((c for c in ORIGINKIT_CATALOG if c['name'] == name), None)
        if not match:
            return Response({'error': 'component not found'}, status=status.HTTP_404_NOT_FOUND)

        code_result = get_originkit_component(name)
        code = ''
        if 'result' in code_result:
            content = code_result['result'].get('content', [])
            for item in content:
                if item.get('type') == 'text':
                    code = item.get('text', '')
                    break

        return Response({
            **match,
            'categoryLabel': CATEGORY_MAP.get(match['category'], match['category']),
            'code': code,
        }, status=status.HTTP_200_OK)
