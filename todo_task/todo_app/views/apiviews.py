#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:18'
# CreateAuthor  : 'Zhengli'


from rest_framework import viewsets
from .. import models, serializers


class TaskViewSet(viewsets.ModelViewSet):
    model = models.TodoTask
    queryset = models.TodoTask.objects.all()
    serializer_class = serializers.TodoTaskSerializer
