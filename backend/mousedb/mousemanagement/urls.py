from django.conf.urls import url, include

from . import views

app_name = 'mousemanagement'

urlpatterns = [
    # url(r'^mouseinsert$', views.mouseinsert, name='mouseinsert'),
    url(r'^category_insert$', views.category_insert, name='category_insert'),
    url(r'^getcategory$',views.getcategory, name='getcategory'),
    url(r'^mouseinsert$',views.mouseinsert, name='mouseinsert'),
    url(r'^getmousetable$',views.getmousetable, name='getmousetable'),
    url(r'^fileupload$',views.fileupload, name='fileupload'),
]
