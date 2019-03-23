#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:18'
# CreateAuthor  : 'Zhengli'

from rest_framework import serializers

from .. import models


class TodoTaskSerializer(serializers.ModelSerializer):
    """
    Todo Task 序列化类
    """
    task_name = serializers.CharField()

    class Meta:
        model = models.TodoTask
        fields = ('id', 'task_name')

