from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import (Design, Category, ContactMessage, Collection, CollectionDesign,
    DesignVersion, Review, DesignRemix, Webhook, AnalyticsEvent, AdminAuditLog)


class HealthViewTest(TestCase):
    def test_health(self):
        client = APIClient()
        response = client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'ok')


class DesignListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Design.objects.create(name='Test Design', category='Landing', framework='React', score=80)
        Design.objects.create(name='Another Design', category='Dashboard', framework='HTML', score=90)

    def test_list_designs(self):
        response = self.client.get('/api/designs/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data['results']), 2)

    def test_filter_by_framework(self):
        response = self.client.get('/api/designs/?framework=React')
        self.assertEqual(response.status_code, 200)
        for d in response.data['results']:
            self.assertEqual(d['framework'], 'React')

    def test_search(self):
        response = self.client.get('/api/designs/?search=Test')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any('Test' in d['name'] for d in response.data['results']))

    def test_sort(self):
        response = self.client.get('/api/designs/?sort=-score')
        self.assertEqual(response.status_code, 200)


class DesignDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.design = Design.objects.create(name='Detail Test', html_code='<h1>Hello</h1>')

    def test_get_design(self):
        response = self.client.get(f'/api/designs/{self.design.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Detail Test')

    def test_get_nonexistent(self):
        response = self.client.get('/api/designs/99999/')
        self.assertEqual(response.status_code, 404)


class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        response = self.client.post('/api/auth/register/', {'username': 'newuser', 'password': 'pass123', 'email': 'test@test.com'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)

    def test_register_short_username(self):
        response = self.client.post('/api/auth/register/', {'username': 'ab', 'password': 'pass123'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_register_duplicate(self):
        User.objects.create_user('taken', password='pass123')
        response = self.client.post('/api/auth/register/', {'username': 'taken', 'password': 'pass123'}, format='json')
        self.assertEqual(response.status_code, 400)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('logintest', password='pass123')

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {'username': 'logintest', 'password': 'pass123'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_login_failure(self):
        response = self.client.post('/api/auth/login/', {'username': 'logintest', 'password': 'wrong'}, format='json')
        self.assertEqual(response.status_code, 401)


class ContactMessageTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_send_message(self):
        response = self.client.post('/api/contact/', {'name': 'Test', 'email': 'test@test.com', 'message': 'Hello'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ContactMessage.objects.exists())

    def test_missing_fields(self):
        response = self.client.post('/api/contact/', {'name': 'Test'}, format='json')
        self.assertEqual(response.status_code, 400)


class CategoryListViewTest(TestCase):
    def setUp(self):
        Category.objects.create(name='Landing', slug='landing', order=1)

    def test_list_categories(self):
        client = APIClient()
        response = client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data['categories']), 1)


class CollectionViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('colluser', password='pass123')
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_create_collection(self):
        response = self.client.post('/api/collections/', {'name': 'My Collection'}, format='json')
        self.assertEqual(response.status_code, 201)

    def test_list_collections(self):
        Collection.objects.create(user=self.user, name='Test')
        response = self.client.get('/api/collections/')
        self.assertEqual(response.status_code, 200)


class ReviewViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('reviewer', password='pass123')
        self.design = Design.objects.create(name='Review Test')
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_create_review(self):
        response = self.client.post(f'/api/designs/{self.design.id}/reviews/', {'rating': 5, 'comment': 'Great!'}, format='json')
        self.assertEqual(response.status_code, 201)

    def test_list_reviews(self):
        Review.objects.create(user=self.user, design=self.design, rating=4, comment='Good')
        response = self.client.get(f'/api/designs/{self.design.id}/reviews/')
        self.assertEqual(response.status_code, 200)


class CompareDesignsViewTest(TestCase):
    def setUp(self):
        self.d1 = Design.objects.create(name='Compare A', score=80)
        self.d2 = Design.objects.create(name='Compare B', score=90)

    def test_compare(self):
        client = APIClient()
        response = client.get(f'/api/designs/compare/?ids={self.d1.id},{self.d2.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['designs']), 2)


class AdminBulkDesignsViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser('adminbulk', password='admin123')
        token = Token.objects.create(user=self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        self.d1 = Design.objects.create(name='Bulk A')
        self.d2 = Design.objects.create(name='Bulk B')

    def test_bulk_delete(self):
        response = self.client.post('/api/admin-auth/designs/bulk/', {'action': 'delete', 'ids': [self.d1.id, self.d2.id]}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['deleted'], 2)

    def test_bulk_category(self):
        response = self.client.post('/api/admin-auth/designs/bulk/', {'action': 'set_category', 'ids': [self.d1.id], 'category': 'Test'}, format='json')
        self.assertEqual(response.status_code, 200)


class WebhookViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('hookuser', password='pass123')
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_create_webhook(self):
        response = self.client.post('/api/webhooks/', {'url': 'https://example.com/hook', 'events': ['design.created']}, format='json')
        self.assertEqual(response.status_code, 201)

    def test_list_webhooks(self):
        response = self.client.get('/api/webhooks/')
        self.assertEqual(response.status_code, 200)


class AnalyticsDashboardViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('analyticsuser', password='pass123')
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_get_dashboard(self):
        response = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('views_by_day', response.data)
