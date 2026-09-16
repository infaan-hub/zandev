from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import AnalyticsEvent
import uuid
import os
import urllib.request
import urllib.parse
import json

token_generator = PasswordResetTokenGenerator()


GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID', '')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET', '')

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if len(username) < 3:
            return Response({'error': 'Username must be at least 3 characters'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        if email and User.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)

        AnalyticsEvent.objects.create(
            event_type='signup',
            user=user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
        )

        return Response({
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'email': user.email, 'is_staff': user.is_staff},
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        AnalyticsEvent.objects.create(
            event_type='login',
            user=user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
        )
        return Response({
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'email': user.email, 'is_staff': user.is_staff},
        })


class UserView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        u = request.user
        return Response({
            'id': u.id, 'username': u.username, 'email': u.email,
            'is_staff': u.is_staff, 'is_superuser': u.is_superuser,
            'date_joined': u.date_joined.isoformat(),
        })


class UserUpdateView(APIView):
    def put(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        u = request.user
        email = request.data.get('email')
        if email:
            if User.objects.filter(email=email).exclude(id=u.id).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)
            u.email = email
        first_name = request.data.get('first_name')
        if first_name is not None:
            u.first_name = first_name
        u.save()
        return Response({'success': True, 'user': {'id': u.id, 'username': u.username, 'email': u.email, 'first_name': u.first_name}})


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).first()
        if user:
            token = token_generator.make_token(user)
            # In production, send email with reset link
            # For now, return token directly (dev mode)
            return Response({
                'success': True,
                'message': 'If the email exists, a reset link has been sent',
                'token': token,
                'user_id': user.id,
            })
        return Response({'success': True, 'message': 'If the email exists, a reset link has been sent'})


class PasswordResetConfirmView(APIView):
    def post(self, request):
        token = request.data.get('token', '')
        password = request.data.get('password', '')
        user_id = request.data.get('user_id')
        if not token or not password or not user_id:
            return Response({'error': 'Token, password, and user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        if not token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()
        return Response({'success': True, 'message': 'Password reset successful'})


class GitHubLoginView(APIView):
    def post(self, request):
        code = request.data.get('code', '')
        if not code:
            return Response({'error': 'Code required'}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange code for access token
        token_data = urllib.parse.urlencode({
            'client_id': GITHUB_CLIENT_ID,
            'client_secret': GITHUB_CLIENT_SECRET,
            'code': code,
        }).encode()

        req = urllib.request.Request(
            'https://github.com/login/oauth/access_token',
            data=token_data,
            headers={'Accept': 'application/json'}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                token_resp = json.loads(resp.read().decode())
        except Exception as e:
            return Response({'error': f'Failed to exchange code: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_resp.get('access_token')
        if not access_token:
            return Response({'error': 'Failed to get access token'}, status=status.HTTP_400_BAD_REQUEST)

        # Get user info from GitHub
        user_req = urllib.request.Request(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json',
            }
        )
        try:
            with urllib.request.urlopen(user_req) as resp:
                gh_user = json.loads(resp.read().decode())
        except Exception as e:
            return Response({'error': f'Failed to get user info: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        github_id = gh_user.get('id')
        username = gh_user.get('login', '')
        email = gh_user.get('email', '')
        avatar = gh_user.get('avatar_url', '')

        if not email:
            # Try to get email from emails endpoint
            email_req = urllib.request.Request(
                'https://api.github.com/user/emails',
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Accept': 'application/json',
                }
            )
            try:
                with urllib.request.urlopen(email_req) as resp:
                    emails = json.loads(resp.read().decode())
                    for e in emails:
                        if e.get('primary') and e.get('verified'):
                            email = e['email']
                            break
                    if not email:
                        for e in emails:
                            if e.get('verified'):
                                email = e['email']
                                break
            except Exception:
                pass

        # Find or create user
        user = None
        if email:
            user = User.objects.filter(email=email).first()
        if not user:
            user = User.objects.filter(username=username).first()
        if not user:
            # Create new user
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f'{base_username}{counter}'
                counter += 1
            user = User.objects.create_user(
                username=username,
                email=email or f'{github_id}@github.local',
                password=uuid.uuid4().hex,
            )

        token, _ = Token.objects.get_or_create(user=user)

        AnalyticsEvent.objects.create(
            event_type='login',
            user=user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            metadata={'provider': 'github'}
        )

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            },
        })


class GoogleLoginView(APIView):
    def post(self, request):
        credential = request.data.get('credential', '')
        if not credential:
            return Response({'error': 'Credential required'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the Google ID token by checking the audience
        # Decode the JWT payload (second segment) to get user info
        try:
            import base64
            parts = credential.split('.')
            if len(parts) != 3:
                return Response({'error': 'Invalid credential format'}, status=status.HTTP_400_BAD_REQUEST)
            payload = parts[1]
            # Add padding
            payload += '=' * (4 - len(payload) % 4)
            decoded = json.loads(base64.urlsafe_b64decode(payload))
        except Exception as e:
            return Response({'error': f'Invalid credential: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify audience matches our client ID
        aud = decoded.get('aud', '')
        if aud != GOOGLE_CLIENT_ID:
            return Response({'error': 'Invalid audience'}, status=status.HTTP_400_BAD_REQUEST)

        # Check token is not expired
        import time
        exp = decoded.get('exp', 0)
        if exp < time.time():
            return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)

        email = decoded.get('email', '')
        name = decoded.get('name', '')
        google_id = decoded.get('sub', '')

        if not email:
            return Response({'error': 'Email not found in token'}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create user
        user = User.objects.filter(email=email).first()
        if not user:
            # Create username from email
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f'{base_username}{counter}'
                counter += 1
            user = User.objects.create_user(
                username=username,
                email=email,
                password=uuid.uuid4().hex,
                first_name=name.split()[0] if name else '',
            )

        token, _ = Token.objects.get_or_create(user=user)

        AnalyticsEvent.objects.create(
            event_type='login',
            user=user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            metadata={'provider': 'google'}
        )

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            },
        })
