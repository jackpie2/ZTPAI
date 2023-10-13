from django.urls import include, path
from rest_framework import routers
from ztpai.api import views

router = routers.DefaultRouter()
router.register(r'coffees', views.CoffeeViewSet)
router.register(r'flavors', views.FlavorViewSet)
router.register(r'origins', views.OriginViewSet)
router.register(r'coffee-flavors', views.CoffeeFlavorViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
