#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:18'
# CreateAuthor  : 'Zhengli'

from django.db import models


class TodoTask(models.Model):
    task_name = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        default_permissions = ("read", "change", "add", "delete")
