# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime
from django.core import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from django.db import OperationalError

import os
# Inserting all models
from .models import Genotype, Phenotype, Sacrificer, Mouse, Project_title, Mouseline
import time



# Importing category for json sending
from mousemanagement.category import Object

# For converting json object
import json

import pandas as pd

from mousemanagement.csv2db import csv2db
from os import listdir
from os.path import isfile, join
import shutil

#Get image gallery
def getimages(request):
    
    physical_id = json.loads(request.body)['physical_id']
    cwd = os.getcwd()

    try:
        mypath = cwd + '/mousemanagement/static/photos/%s' % physical_id
        filelists = [f for f in listdir(mypath) if isfile(join(mypath, f)) and '.jpg' in f]
    
    except OSError:
        response = makeEvent(
            name='mouseimageevent',
            result= 'The target [%s] mouse does not have image folder.',
            error=True,
            errorCode=12)            
        
        return response 

    filelistsString = ''

    for file in filelists:
        filelistsString += file + ','

    response = makeEvent(
        name='mouseimageevent',
        result= filelistsString,
        error=False,
        errorCode=0)  

    return response

#Handling image upload
def imageFileUpload(request):
    fileid = request.POST['fileid']
    file = request.FILES['file']
    filename = request.POST['filename']
    physical_id = request.POST['physical_id']
    cwd = os.getcwd()
    mypath = cwd + '/mousemanagement/static/photos/%s' % physical_id

    if(not os.path.isdir(mypath)):
        os.makedirs(mypath)
    

    temp_path = handle_uploaded_file(file, mypath + '/' + filename)

    error = False
    if(not os.path.isfile(mypath + '/' + filename)): 
        error = True  

    errorCode = 13 if error else 0

    if(error):
        response = makeUploadEvent(
            name='UploadImageEvent',
            result=record_error,
            error=error,
            errorCode=errorCode,
            fileid=fileid
        )
    else:
        response = makeUploadEvent(
            name='UploadImageEvent',
            result='%s Image Uploaded.' % filename,
            error=error,
            errorCode=errorCode,
            fileid=fileid
        )        

    return response    

#Handing file upload
def fileupload(request):
    fileid = request.POST['fileid']
    file = request.FILES['file']
    filename = request.POST['filename']

    path = handle_uploaded_file(file, filename)

    (record_error, error) = parsecsv(path)

    errorCode = 9 if error else 0

    if(error):
        response = makeUploadEvent(
            name='UploadCSVEvent',
            result=record_error,
            error=error,
            errorCode=errorCode,
            fileid=fileid
        )
    else:
        response = makeUploadEvent(
            name='UploadCSVEvent',
            result='All The mouse has been imported into database.',
            error=error,
            errorCode=errorCode,
            fileid=fileid
        )        

    return response

def parsecsv(file):
    csv2dbhandler = csv2db(file)
    finished = False
    while(not finished):
        try:
            (record_error, error) = csv2dbhandler.startparsing()
            finished = True
            os.remove(file)
        except OperationalError:
            time.sleep(3)
    return (record_error, error)

#Gets parts of file and write to disk drive
def handle_uploaded_file(file, filename):
    path = default_storage.save(filename, ContentFile(file.read()))
    return path

#Get mouse table
def getmousetable(request):
    mouseLists = serializers.serialize("json", Mouse.objects.all())
    
    
    resposne = makeMouseLists(
        name='mousetableevent',
        result= mouseLists,
        error=False,
        errorCode=0
    )

    return resposne

def makeMouseLists(name, result, error, errorCode):
    event = Object()
    event.name = name
    event.error = error
    event.errorCode = errorCode
    event.result = result
    event_json = event.toJSON()
    response = HttpResponse(result, content_type="application/json")
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "http://localhost:4200/"
    return response


#Update Mouse section
def updatemouse(request):
    json_mouse_data = json.loads(request.body)
    physical_id_input = json_mouse_data['physical_id']
    error = False
    error_message = ''
    #Check If Existing mouse
    count = Mouse.objects.filter(physical_id=physical_id_input).count()
    if count == 0:
        response = makeEvent(
        name='mouseinsertEvent',
        result='Particular mouse not found in the database.Check with the admin.[%s]' % physical_id_input,
        error=True,
        errorCode=10)            
        
        return response  

    mouse = Mouse.objects.get(physical_id__exact=physical_id_input)
    mouse.gender = json_mouse_data['gender']


    #Get Mouse Line
    (mouseline, error_message, error) = getItemFromDatabase(json_mouse_data['mouseline'], error, error_message, Mouseline, 'Mouseline')

    #Get PhenoType
    (phenotype, error_message, error) = getItemFromDatabase(json_mouse_data['phenotype'], error, error_message, Phenotype, 'Phenotype')

    #Get GenotType
    (genotype, error_message, error) = getItemFromDatabase(json_mouse_data['genotype'], error, error_message, Genotype, 'Genotype')

    #Get Sacrificer
    (sacrificer, error_message, error) = getItemFromDatabase( json_mouse_data['sacrificer'], error, error_message, Sacrificer, 'Sacrificer')

    #Get Project_Title
    (project_title, error_message, error) = getItemFromDatabase(json_mouse_data['project_title'], error, error_message, Project_title, 'Project_title')


    if error:
        response = makeEvent(
        name='mouseupdateevent',
        result= error_message + '.Mouse [%s]' % physical_id_input,
        error=True,
        errorCode=10)            
        
        return response 

    mouse.mouseline = mouseline
    mouse.genotype = genotype
    mouse.sacrificer = sacrificer
    mouse.project_title = project_title
    mouse.phenotype = phenotype


    birthdate_input = json_mouse_data['birthdate']
    birthdate = datetime.strptime(birthdate_input, '%d/%m/%Y')
    birthdate = birthdate.strftime("%Y-%m-%d")
    mouse.birthdate = birthdate

    deathdate_input = json_mouse_data['deathdate']
    deathdate = datetime.strptime(deathdate_input, '%d/%m/%Y')
    deathdate = deathdate.strftime("%Y-%m-%d")
    mouse.deathdate = deathdate


    mouse.genotype_confirmation = json_mouse_data['genotype_confirmation']

    mouse.purpose = json_mouse_data['purpose']
    mouse.comment= json_mouse_data['comment']

    mouse.pfa_liver = json_mouse_data['pfa']['liver']
    mouse.pfa_liver_tumor = json_mouse_data['pfa']['liver_tumor']
    mouse.pfa_small_intenstine = json_mouse_data['pfa']['small_intenstine']
    mouse.pfa_small_intenstine_tumor = json_mouse_data['pfa']['small_intenstine_tumor']
    mouse.pfa_skin = json_mouse_data['pfa']['skin']
    mouse.pfa_skin_hair = json_mouse_data['pfa']['skin_hair']
    mouse.pfa_other = json_mouse_data['pfa']['other']
    mouse.freezedown_liver = json_mouse_data['freezedown']['liver']
    mouse.freezedown_liver_tumor = json_mouse_data['freezedown']['liver_tumor']
    mouse.freezedown_other = json_mouse_data['freezedown']['other']

    try:
        mouse.save()
    except ValueError:
        response = makeEvent(
            name='mouseupdateevent',
            result='Encounter internal database error.[%s]' % physical_id_input,
            error=True,
            errorCode=11
        )
        return response 
    
    response = makeEvent(
        name='mouseupdateevent',
        result='The mouse has been successfullty updated.[%s]' % physical_id_input,
        error=False,
        errorCode=0
    )            
    return response



#Insert Mouse section
def mouseinsert(request):
    json_mouse_data = json.loads(request.body)

    physical_id_input = json_mouse_data['physical_id']

    #Check If Existing mouse
    count = Mouse.objects.filter(physical_id=physical_id_input).count()
    if count != 0:
        response = makeEvent(
        name='mouseinsertEvent',
        result='Same mouse has been inserted.[%s]' % physical_id_input,
        error=True,
        errorCode=8)            
        
        return response

    gender_input = json_mouse_data['gender']
    mouseline_input = json_mouse_data['mouseline']
    
    birthdate_input = json_mouse_data['birthdate']
    birthdate = datetime.strptime(birthdate_input, '%d/%m/%Y')
    birthdate = birthdate.strftime("%Y-%m-%d")
    print(birthdate)
    deathdate_input = json_mouse_data['deathdate']
    deathdate = datetime.strptime(deathdate_input, '%d/%m/%Y')
    deathdate = deathdate.strftime("%Y-%m-%d")

    genotype_input = json_mouse_data['genotype']
    genotype_confirmation_input = json_mouse_data['genotype_confirmation']
    phenotype_input = json_mouse_data['phenotype']
    project_title_input = json_mouse_data['project_title']
    sacrificer_input = json_mouse_data['sacrificer']

    purpose_input = json_mouse_data['purpose']
    comment_input = json_mouse_data['comment']

    pfa_liver_input = json_mouse_data['pfa']['liver']
    pfa_liver_tumor_input = json_mouse_data['pfa']['liver_tumor']
    pfa_small_intenstine_input = json_mouse_data['pfa']['small_intenstine']
    pfa_small_intenstine_tumor_input = json_mouse_data['pfa']['small_intenstine_tumor']
    pfa_skin_input = json_mouse_data['pfa']['skin']
    pfa_skin_hair_input = json_mouse_data['pfa']['skin_hair']
    pfa_other_input = json_mouse_data['pfa']['other']
    freezedown_liver_input = json_mouse_data['freezedown']['liver']
    freezedown_liver_tumor_input = json_mouse_data['freezedown']['liver_tumor']
    freezedown_other_input = json_mouse_data['freezedown']['other']

    error_message = ''
    error = False
    

    #Get Mouse Line
    (mouseline, error_message, error) = getItemFromDatabase(mouseline_input, error, error_message, Mouseline, 'Mouseline')

    #Get PhenoType
    (phenotype, error_message, error) = getItemFromDatabase(phenotype_input, error, error_message, Phenotype, 'Phenotype')

    #Get GenotType
    (genotype, error_message, error) = getItemFromDatabase(genotype_input, error, error_message, Genotype, 'Genotype')

    #Get Sacrificer
    (sacrificer, error_message, error) = getItemFromDatabase(sacrificer_input, error, error_message, Sacrificer, 'Sacrificer')

    #Get Project_Title
    (project_title, error_message, error) = getItemFromDatabase(project_title_input, error, error_message, Project_title, 'Project_title')


    if(error):
        print(error_message)
    else:
        print('No Error')

    if(not error):
        mouse = Mouse(
            physical_id = physical_id_input,
            gender=gender_input,
            mouseline=mouseline,
            birthdate=birthdate,
            deathdate=deathdate,
            genotype=genotype,
            genotype_confirmation=genotype_confirmation_input,
            phenotype=phenotype,
            project_title=project_title,
            sacrificer=sacrificer,
            purpose=purpose_input,
            comment=comment_input,
            pfa_liver=pfa_liver_input,
            pfa_liver_tumor=pfa_liver_tumor_input,
            pfa_small_intenstine=pfa_small_intenstine_input,
            pfa_small_intenstine_tumor=pfa_small_intenstine_tumor_input,
            pfa_skin=pfa_skin_input,
            pfa_skin_hair=pfa_skin_hair_input,
            pfa_other=pfa_other_input,
            freezedown_liver=freezedown_liver_input,
            freezedown_liver_tumor=freezedown_liver_tumor_input,
            freezedown_other=freezedown_other_input
        )

        id = mouse.save()
        count = Mouse.objects.filter(physical_id=physical_id_input).count()
        if count == 1:
            response = makeEvent(
                name='mouseinsertEvent',
                result='The mouse has been successfullty inserted.[%s]' % physical_id_input,
                error=False,
                errorCode=0
            )            
            return response
        else:
            response = makeEvent(
                name='mouseinsertEvent',
                result='The mouse was unsuccessfullty inserted.[%s], <br> May due to database internal problem' % physical_id_input,
                error=True,
                errorCode=4
            )                           
        return response
    else:        
        response = makeEvent(
            name='mouseinsertEvent',
            result=error_message,
            error=True,
            errorCode=5
        )
        return response
    

def getItemFromDatabase(key, error, error_message, typeObject, typestring):
    result = ''
    try:
        result = typeObject.objects.get(name__exact=key)
    except typeObject.DoesNotExist:
        error_message += typestring + ' entered was either empty or not existed in the database.' 
        error |= True

    return result, error_message, error

#Category

def getcategory(request):

    before_json_objects = Object()

    # Get mouselines from db
    before_json_objects.mouselines = list(
        Mouseline.objects.values_list('name', flat=True))

    # Get genotypes from db
    before_json_objects.genotypes = list(
        Genotype.objects.values_list('name', flat=True))

    # Get phenotypes from db
    before_json_objects.phenotypes = list(
        Phenotype.objects.values_list('name', flat=True))

    # Get Sacrificer from db
    before_json_objects.sacrificers = list(
        Sacrificer.objects.values_list('name', flat=True))

    # Get Project Title from db
    before_json_objects.project_titles = list(
        Project_title.objects.values_list('name', flat=True))

    json_object = before_json_objects.toJSON()

    response = makeEvent(
        name='getCategoryEvent',
        result=before_json_objects,
        error=False,
        errorCode=0
    )

    return response


# This is for inserting all the category
def category_insert(request):

    # Using this way to decode json data
    json_data = json.loads(request.body)
    input = json_data['input']
    type = json_data['type']

    count = getcount(type=type, input=input)

    if(count == -1):
        response = makeEvent(
            name='getCategoryEvent',
            result='',
            error=True,
            errorCode=1
        )
        return response

    elif(count >= 1):
        response = makeEvent(
            name='getCategoryEvent',
            result='',
            error=True,
            errorCode=2
        )
        return response
    else:
        result = makeinsertion(type=type, input=input)

    if(result):
        response = makeEvent(
            name='getCategoryEvent',
            result=result,
            error=False,
            errorCode=0
        )
    else:
        response = makeEvent(
            name='getCategoryEvent',
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

def makeUploadEvent(name, result, error, errorCode, fileid):
    event = Object()
    event.name = name
    event.error = error
    event.errorCode = errorCode
    event.result = result
    event.fileid = fileid
    event_json = event.toJSON()
    response = HttpResponse(event_json, content_type="application/json")
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "http://localhost:4200/"
    return response


