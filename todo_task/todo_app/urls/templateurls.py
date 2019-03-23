#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:43'
# CreateAuthor  : 'Zhengli'

from django.conf.urls import url

from ..views import templateviews

urlpatterns = [
    url(r'^$', templateviews.index),
]
