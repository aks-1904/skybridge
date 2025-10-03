from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User, UserProfile, AadhaarVerification, PhoneVerification
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    AadhaarVerificationSerializer, PhoneVerificationSerializer
)
from datetime import datetime, timedelta
import random

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate phone OTP
            otp = str(random.randint(100000, 999999))
            PhoneVerification.objects.create(
                user=user,
                otp=otp,
                expires_at=datetime.now() + timedelta(minutes=10)
            )
            # In real implementation, send OTP via SMS
            return Response({
                'message': 'User registered successfully. OTP sent to phone.',
                'user_id': user.id,
                'otp': otp
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_verified:
                    token, created = Token.objects.get_or_create(user=user)
                    return Response({
                        'token': token.key,
                        'user': UserSerializer(user).data
                    })
                else:
                    return Response({
                        'error': 'Account not verified'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_phone(self, request):
        user_id = request.data.get('user_id')
        otp = request.data.get('otp')
        
        try:
            verification = PhoneVerification.objects.get(
                user_id=user_id,
                otp=otp,
                expires_at__gt=datetime.now()
            )
            verification.is_verified = True
            verification.save()
            
            user = verification.user
            user.is_verified = True
            user.save()
            
            return Response({'message': 'Phone verified successfully'})
        except PhoneVerification.DoesNotExist:
            return Response({
                'error': 'Invalid or expired OTP'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_aadhaar(self, request):
        serializer = AadhaarVerificationSerializer(data=request.data)
        if serializer.is_valid():
            # In real implementation, verify with UIDAI
            AadhaarVerification.objects.create(
                user=request.user,
                aadhaar_number=serializer.validated_data['aadhaar_number'],
                is_verified=True,
                verification_date=datetime.now()
            )
            return Response({'message': 'Aadhaar verified successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)