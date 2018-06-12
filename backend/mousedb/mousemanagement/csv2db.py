import pandas as pd
import os
import django
from datetime import datetime
import numpy as np
from mousemanagement.models import Mouse, Phenotype, Genotype, Mouseline, Sacrificer, Project_title


class csv2db:

    def __init__(self, csvfile):
        print('csv2db initialized.')
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mousedb.settings")
        django.setup()
        self.csvfile = csvfile

    def startparsing(self):
        data = pd.read_csv(self.csvfile,keep_default_na=True,na_values='')

        print(data.columns.values)

        record_error = ''
        error = True
        for index, row in data.iterrows():
            # if row['physical_id'] == '':
            #     record_error += 'Data Contains empty physical ID'
            #     continue
            existed = self.checkExisting(row['physical_id'])
            if(existed):
                record_error += 'Same Phsyical ID Mouse Existed [%s].' % row['physical_id']
            else:
                error = False
                # error_message, error = self.checkIfAnyEmpty(row)
                if(not error):
                    mouse = self.parseMouse(row)
                    mouse.save()
                    error = False
                else:
                    record_error += ('For [%s] mouse,' + error_message ) % row['physical_id']
        return record_error, error

    def checkExisting(self, physical_id):
        # Check If Existing mouse
        count = Mouse.objects.filter(physical_id=physical_id).count()
        if count != 0:
            return True
        else:
            return False


    def getItemFromDatabase(self, inputstring, typeObject, typeString):
        result = ''
        try:
            result = typeObject.objects.get(name__exact=inputstring)
        except typeObject.DoesNotExist:
            if(typeString == 'mouseline'):
                result = Mouseline(inputstring)
                result.save()
            elif(typeString == 'genotype'):
                result = Genotype(inputstring)
                result.save()
            elif(typeString == 'phenotype'):
                result = Phenotype(inputstring)
                result.save()
            elif(typeString == 'project_title'):
                result = Project_title(inputstring)
                result.save()
            elif(typeString == 'sacrificer'):
                result = Sacrificer(inputstring)
                result.save()

        return result

    def checkIfAnyEmpty(self, row_value):
        error_message = ''
        for key in row_value.keys():
            if('pfa' in key):
                continue
            if('freezedown' in key):
                continue
            
            if(np.isnan(row_value[key])):
                error_message ='All the mouses fields cannot be empty except pfa and freezedown.'
                return True, error_message
        
        return False, ''
    def parseMouse(self, row_value):
        row_dict = dict()

        mouseline = self.getItemFromDatabase(
                        row_value['mouseline'],
                        Mouseline,
                        'mouseline'
                    )

        genotype =  self.getItemFromDatabase(
                        row_value['genotype'],
                        Genotype,
                        'genotype'
                    )

        phenotype = self.getItemFromDatabase(
                        row_value['phenotype'],
                        Phenotype,
                        'phenotype'
                    )

        project_title = self.getItemFromDatabase(
                        row_value['project_title'],
                        Project_title,
                        'project_title'
                    )

        sacrificer = self.getItemFromDatabase(
                        row_value['sacrificer'],
                        Sacrificer,
                        'sacrificer'
                    )


        birthdate = datetime.strptime(row_value['birthdate'], '%d/%m/%Y')
        birthdate = birthdate.strftime("%Y-%m-%d")

        deathdate = datetime.strptime(row_value['deathdate'], '%d/%m/%Y')
        deathdate = deathdate.strftime("%Y-%m-%d")


        if np.isnan(row_value['pfa_other']):
            pfa_other =  '' 
        else:
            pfa_other =  row_value['pfa_other']

        if np.isnan(row_value['freezedown_other']):
            freezedown_other =  '' 
        else:
            freezedown_other =  row_value['freezedown_other']

        print(pfa_other)

        mouse = Mouse(
            physical_id = row_value['physical_id'],
            gender=row_value['gender'],
            mouseline=mouseline,
            birthdate=birthdate,
            deathdate=deathdate,
            genotype=genotype,
            genotype_confirmation=row_value['genotype_confirmation'],
            phenotype=phenotype,
            project_title=project_title,
            sacrificer=sacrificer,
            purpose=row_value['purpose'],
            comment=row_value['comment'],
            pfa_liver=row_value['pfa_liver'],
            pfa_liver_tumor=row_value['pfa_liver_tumor'],
            pfa_small_intenstine=row_value['pfa_small_intenstine'],
            pfa_small_intenstine_tumor=row_value['pfa_small_intenstine_tumor'],
            pfa_skin=row_value['pfa_skin'],
            pfa_skin_hair=row_value['pfa_skin_hair'],
            pfa_other= pfa_other,
            freezedown_liver=row_value['freezedown_liver'],
            freezedown_liver_tumor=row_value['freezedown_liver_tumor'],
            freezedown_other=freezedown_other,
        )
        return mouse
