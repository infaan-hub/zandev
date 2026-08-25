from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


# Hard‑coded sample data – in a real app this would come from a model / DB
DESIGNS = [
    {
        'id': 1,
        'name': 'Card Component',
        'preview': 'https://images.mixkit.com/cover-images/mixkit-photographer-portrait-2458-large.jpg',
    },
    {
        'id': 2,
        'name': 'Button Group',
        'preview': 'https://images.mixkit.com/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg',
    },
]


class DesignListView(APIView):
    """GET /api/designs/ – return the list of designs."""
    def get(self, request):
        return Response(DESIGNS, status=status.HTTP_200_OK)


class DesignExportView(APIView):
    """POST /api/designs/{id}/export – return a code snippet."""
    def post(self, request, pk=None):
        # Find the design by id
        design = next((d for d in DESIGNS if d['id'] == int(pk)), None)
        if not design:
            return Response({'error': 'design not found'}, status=status.HTTP_404_NOT_FOUND)

        # Dummy HTML snippet (replace with real AI/MCP generated code)
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>{design['name']}</title>
          <style>
            .card {{ padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
          </style>
        </head>
        <body>
          <div class="card">
            <h2>{design['name']}</h2>
            <p>Exported component – integrate with your React app.</p>
          </div>
        </body>
        </html>
        """
        return Response({'code': html.strip(), 'design_id': design['id']}, status=status.HTTP_200_OK)