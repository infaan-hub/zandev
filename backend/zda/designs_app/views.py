from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{d.name}</title>
  <style>
    .card {{ padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
  </style>
</head>
<body>
  <div class="card">
    <h2>{d.name}</h2>
    <p>Exported component - integrate with your React app.</p>
  </div>
</body>
</html>"""
        d.exports += 1
        d.save(update_fields=['exports'])
        return Response({'code': html.strip(), 'design_id': d.id}, status=status.HTTP_200_OK)


class StatsView(APIView):
    def get(self, request):
        from django.db.models import Sum
        agg = Design.objects.aggregate(
            total_designs=models.Count('id'),
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


from django.db import models
