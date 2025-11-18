from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile, AadhaarVerification, PhoneVerification
import random
from datetime import datetime, timedelta

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password', 'confirm_password', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude = ['user']

class AadhaarVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AadhaarVerification
        fields = ['aadhaar_number']

class PhoneVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneVerification
        fields = ['otp']
        read_only_fields = ['user', 'expires_at', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'role', 'is_verified', 'profile']