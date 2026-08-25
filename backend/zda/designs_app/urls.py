from django.urls import path
from . import views

urlpatterns = [
    path('', views.DesignListView.as_view(), name='design-list'),
    path('<int:pk>/export/', views.DesignExportView.as_view(), name='design-export'),
]