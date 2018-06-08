# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Genotype, Phenotype, Mouseline, Sacrificer, Project_title, Mouse

# Register your models here.

admin.site.register(Genotype)
admin.site.register(Phenotype)
admin.site.register(Mouseline)
admin.site.register(Sacrificer)
admin.site.register(Project_title)
admin.site.register(Mouse)