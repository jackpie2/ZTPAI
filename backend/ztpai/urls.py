from django.urls import include, path
from rest_framework import routers
from ztpai.api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
router.register(r'coffees', views.CoffeeViewSet)
router.register(r'flavors', views.FlavorViewSet)
router.register(r'origins', views.OriginViewSet)
router.register(r'species', views.SpeciesViewSet)
router.register(r'roasts', views.RoastViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0),
         name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc',
                                       cache_timeout=0), name='schema-redoc'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('signin/', views.JWTAuth.as_view(), name='jwt_auth'),
    path('signin/refresh/', views.JWTRefresh.as_view(), name='token_refresh'),
    path('signup/', views.SignUp.as_view(), name='signup'),
]
