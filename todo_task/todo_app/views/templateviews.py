#!/usr/bin/env python
# -*- coding: utf-8 -*-
# ProjectName   : 'todo_task'
# CreateTime    : '2019/03/23 11:18'
# CreateAuthor  : 'Zhengli'

from django.shortcuts import render


def index(request):
    return render(request, 'index.html')
