from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShipmentViewSet, RestrictedItemViewSet

router = DefaultRouter()
router.register(r'', ShipmentViewSet)
router.register(r'restricted-items', RestrictedItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]