#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:18'
# CreateAuthor  : 'Zhengli'

from rest_framework import routers

from ..views import apiviews

urlpatterns = []

# register api url
api_router = routers.DefaultRouter()
api_router.register(r'todotasks', apiviews.TaskViewSet)

urlpatterns += api_router.urls
