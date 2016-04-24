from django.conf.urls import include, url
from rest_framework import routers
from django.contrib import admin
from pots import views

router = routers.DefaultRouter()
router.register(r'pots', views.PotViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'deployments', views.DeploymentViewSet)
router.register(r'fishers', views.FisherViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^storms', views.getStormData, name="storms"),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls))
]
