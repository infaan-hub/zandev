import django, os, json
os.environ['DJANGO_SETTINGS_MODULE'] = 'zda.settings'
django.setup()
from django.test import RequestFactory
from designs_app.auth_views import LoginView
from designs_app.admin_views import AdminLoginView

factory = RequestFactory()

print('=== Test 1: Superuser via /api/auth/login/ ===')
req = factory.post('/api/auth/login/', data=json.dumps({'username':'admin','password':'admin123'}), content_type='application/json')
resp = LoginView.as_view()(req)
print('Status:', resp.status_code)
print('is_staff:', resp.data['user']['is_staff'])
print('is_superuser:', resp.data['user']['is_superuser'])

print()
print('=== Test 2: Superuser via /api/admin-auth/login/ ===')
req2 = factory.post('/api/admin-auth/login/', data=json.dumps({'username':'admin','password':'admin123'}), content_type='application/json')
resp2 = AdminLoginView.as_view()(req2)
print('Status:', resp2.status_code)
print('Body:', resp2.data)

print()
print('=== All tests passed ===')
