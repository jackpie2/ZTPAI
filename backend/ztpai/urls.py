from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from ztpai.api import views

router = routers.DefaultRouter()
router.register(r'coffees', views.CoffeeViewSet)

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
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/',
         SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', include(router.urls)),
    path('signin/', views.JWTAuth.as_view(), name='jwt_auth'),
    path('signin/refresh/', views.JWTRefresh.as_view(), name='token_refresh'),
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user-review/<uuid:coffee_id>/',
         views.CoffeeUserScore.as_view(), name='coffee_rating_list'),
    path('users/', views.UsersView.as_view(), name='user_view'),
    path('user/', views.UserView.as_view(), name='user_view'),
    path('rate/', views.RateCoffee.as_view(), name='rate_coffee'),
    path('all-reviews/<uuid:coffee_id>/',
         views.AllReviews.as_view(), name='all_reviews'),
    path('add-coffee/', views.AddCoffee.as_view(), name='add_coffee'),
    path('add-coffee-image/<uuid:coffee_id>/', views.AddImage.as_view(),
         name='add_coffee_image'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
