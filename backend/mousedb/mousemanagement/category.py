import json
# class category:
#     def __init__(self):
#         self._mouselines = []
#         self._sacrificers = []
#         self._project_titles = []
#         self._phenotypes = []
#         self._genotypes = []

#     def addmouseline(self, mouseline):
#         self._mouselines.append(mouseline)
    
#     def addsacrificer(self, sacrificer):
#         self._sacrificers.append(sacrificer)

#     def addproject_title(self, project_title):
#         self._project_titles.append(project_title)
    
#     def addphenotypes(self, phenotype):
#         self._phenotypes.append(phenotype)

#     def addgenotypes(self, genotype):
#         self._genotypes.append(genotype)

class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)