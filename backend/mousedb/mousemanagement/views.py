# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse


#Inserting all models
from .models import Genotype, Phenotype, Sacrificer, Mouse, Project_title, Mouseline


#Importing category for json sending
from category import Object

#For converting json object
import json

# def mouseinsert(request):
#     json_mouse_data = json.loads(request.GET['data'])
#     physical_id = json_mouse_data['physical_id']

#     count = Mouse.objects.filter(physical_id=physical_id).count()

#     if count >= 1:
#         print('There is existing primary key exists')




def getcategory(request):
    
    before_json_objects = Object()
    
    
    #Get mouselines from db
    before_json_objects.mouselines = list(Mouseline.objects.values_list('name', flat=True))

    #Get genotypes from db
    before_json_objects.genotypes = list(Genotype.objects.values_list('name', flat=True))

    #Get phenotypes from db
    before_json_objects.phenotypes = list(Phenotype.objects.values_list('name', flat=True))

    #Get Sacrificer from db
    before_json_objects.sacrificers = list(Sacrificer.objects.values_list('name', flat=True))

    #Get Project Title from db
    before_json_objects.project_titles = list(Project_title.objects.values_list('name', flat=True))

    json_object = before_json_objects.toJSON()

    response = makeEvent(
            name='getCategory',
            result=before_json_objects,
            error=False,
            errorCode=0
        )

    return response


#This is for inserting all the category
def category_insert(request):

    #Using this way to decode json data
    json_data = json.loads(request.body)
    input = json_data['input']
    type = json_data['type']

    count = getcount(type=type, input=input)

    if(count == -1):
        response = makeEvent(
            name='CategoryInsert',
            result='',
            error=True,
            errorCode=1
        )
        return response

    elif(count >= 1):
        response = makeEvent(
            name='CategoryInsert',
            result='',
            error=True,
            errorCode=2
        )
        return response
    else:
        result = makeinsertion(type=type, input=input)
    
    if(result):
        response = makeEvent(
            name='CategoryInsert',
            result=result,
            error=False,
            errorCode=0
        )
    else:
        response = makeEvent(
            name='CategoryInsert',
            result='',
            error=True,
            errorCode=2
        ) 
    return response

def getcount(type, input):
    if(type == 'genotype'):
        return Genotype.objects.filter(name=input).count()
    elif(type == 'phenotype'):
        return Phenotype.objects.filter(name=input).count()
    elif(type == 'sacrificer'):
        return Sacrificer.objects.filter(name=input).count()
    elif(type == 'project_title'):
        return Project_title.objects.filter(name=input).count()
    elif(type == 'mouseline'):
        return Mouseline.objects.filter(name=input).count()
    else:
        return -1

def makeinsertion(type, input):
    if(type == 'genotype'):
        genotype = Genotype(input)
        genotype.save()
        return 'New GenoType Record is inserted [%s].' % input 
    elif(type == 'phenotype'):
        phenotype = Phenotype(input)
        phenotype.save()
        return 'New Phenotype Record is inserted [%s].' % input 
    elif(type == 'sacrificer'):
        sacrificer = Sacrificer(input)
        sacrificer.save()
        return 'New Sacrificer Record is inserted [%s].' % input
    elif(type == 'project_title'):
        project_title = Project_title(input)
        project_title.save()
        return 'New Project title Record is inserted [%s].' % input
    elif(type == 'mouseline'):
        mouseline = Mouseline(input)
        mouseline.save()
        return 'New Mouseline Record is inserted [%s].' % input
    else:
        return None

def makeEvent(name, result, error, errorCode):
    event = Object()
    event.name = name
    event.error = error
    event.errorCode = errorCode
    event.result = result
    event_json = event.toJSON()
    response = HttpResponse(event_json, content_type="application/json")
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "http://localhost:4200/"
    return response   