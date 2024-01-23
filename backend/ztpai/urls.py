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
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenVerifyView

router = routers.DefaultRouter()
router.register(r'coffees', views.CoffeeViewSet)
router.register(r'flavors', views.FlavorViewSet)
router.register(r'origins', views.OriginViewSet)
router.register(r'species', views.SpeciesViewSet)
router.register(r'roasts', views.RoastViewSet)
# router.register(r'users', views.UserViewSet)
# router.register(r'ratings', views.CoffeeRatingViewSet)
# router.register(r'groups', views.UserGroupViewSet)

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
    # path('swagger<format>/', schema_view.without_ui(cache_timeout=0),
    #      name='schema-json'),
    # path('swagger/', schema_view.with_ui('swagger',
    #      cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc',
    #                                    cache_timeout=0), name='schema-redoc'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/',
         SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('signin/', views.JWTAuth.as_view(), name='jwt_auth'),
    path('signin/refresh/', views.JWTRefresh.as_view(), name='token_refresh'),
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('coffee-user-review/<uuid:coffee_id>/',
         views.CoffeeUserScore.as_view(), name='coffee_rating_list'),
    path('users/', views.UsersView.as_view(), name='user_view'),
    path('user/', views.UserView.as_view(), name='user_view'),
    path('rate/', views.RateCoffee.as_view(), name='rate_coffee'),
    path('all-reviews/<uuid:coffee_id>/',
         views.AllReviews.as_view(), name='all_reviews'),
]
