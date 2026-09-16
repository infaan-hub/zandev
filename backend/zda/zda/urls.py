from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as static_serve
import os

def debug_media(request):
    from django.http import JsonResponse
    mr = settings.MEDIA_ROOT
    files = []
    gallery_dir = os.path.join(mr, 'designs', 'gallery')
    if os.path.isdir(gallery_dir):
        files = os.listdir(gallery_dir)[:5]
    return JsonResponse({
        'MEDIA_ROOT': mr,
        'MEDIA_URL': settings.MEDIA_URL,
        'DEBUG': settings.DEBUG,
        'gallery_exists': os.path.isdir(gallery_dir),
        'gallery_files': files,
        'gallery_count': len(os.listdir(gallery_dir)) if os.path.isdir(gallery_dir) else 0,
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('designs_app.urls')),
    path('debug/media/', debug_media),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        path('media/<path:path>', lambda request, path: static_serve(request, path, document_root=settings.MEDIA_ROOT)),
    ]
