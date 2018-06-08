# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

DATE_INPUT_FORMATS = ['%d-%m-%Y']

# Geno Type Category
class Genotype(models.Model):
    name = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.name

# Pheno Type Category
class Phenotype(models.Model):
    name = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.name

# Mouse Line Category
class Mouseline(models.Model):
    name = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.name

# Sacrificer Category
class Sacrificer(models.Model):
    name = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.name

# ProjectTitle Category
class Project_title(models.Model):
    name = models.CharField(max_length=40, primary_key=True)

    def __str__(self):
        return self.name


# Mouse Model
class Mouse(models.Model):
    physical_id = models.CharField(max_length=10, primary_key=True)
    GENDER_CHOICES = (
        ('M','Male'),
        ('F','Female'),
    )
    gender = models.CharField(max_length=7, choices=GENDER_CHOICES)

    mouseline = models.ForeignKey(Mouseline, on_delete=models.CASCADE)
    birthdate = models.DateField(blank = False)
    deathdate = models.DateField(blank = True)
    genotype = models.ForeignKey(Genotype, on_delete=models.CASCADE)
    genotype_confirmation = models.CharField(max_length=30, blank = True, null = True)
    phenotype = models.ForeignKey(Phenotype, on_delete=models.CASCADE)
    project_title = models.ForeignKey(Project_title, on_delete=models.CASCADE)
    sacrificer = models.ForeignKey(Sacrificer, on_delete=models.CASCADE)
    purpose = models.CharField(max_length=200, blank = True, null = True)
    comment = models.CharField(max_length=300, blank = True, null = True)

    #PFA Model
    pfa_liver = models.BooleanField(default=False)
    pfa_liver_tumor = models.BooleanField(default=False)
    pfa_small_intenstine = models.BooleanField(default=False)
    pfa_small_intenstine_tumor = models.BooleanField(default=False)
    pfa_skin = models.BooleanField(default=False)
    pfa_skin_hair = models.BooleanField(default=False)
    pfa_other = models.CharField(max_length=20, blank = True, null = True)

    #FreezeDown Model
    freezedown_liver = models.BooleanField(default=False)
    freezedown_liver_tumor = models.BooleanField(default=False)
    freezedown_other = models.CharField(max_length=20, blank = True, null = True)


