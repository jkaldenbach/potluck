from django.conf.urls import url
from . import views

app_name = 'pots'
urlpatterns = [
    #/pots
    url(r'^$', views.index, name='index'),
    #/pots/:id
    url(r'^(?P<id>[\d]+)/$', views.pot, name='pot')
]
