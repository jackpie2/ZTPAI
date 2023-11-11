from django.urls import include, path
from rest_framework import routers
from ztpai.api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
router = routers.DefaultRouter()
router.register(r'coffees', views.CoffeeViewSet)
router.register(r'flavors', views.FlavorViewSet)
router.register(r'origins', views.OriginViewSet)
router.register(r'species', views.SpeciesViewSet)
router.register(r'roasts', views.RoastViewSet)
router.register(r'register', views.RegisterViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
