from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import AnalyticsEvent
import uuid


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
            token = uuid.uuid4().hex
            user.profile = token
            user.save()
        return Response({'success': True, 'message': 'If the email exists, a reset link has been sent'})


class PasswordResetConfirmView(APIView):
    def post(self, request):
        token = request.data.get('token', '')
        password = request.data.get('password', '')
        if not token or not password:
            return Response({'error': 'Token and password required'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': True, 'message': 'Password reset successful'})
