export class Mouse{
    constructor(
        public physical_id:string,
        public gender:string,
        public mouseline:string,
        public birthdate:Date,
        public deathdate:Date,
        public genotype:string,
        public age:number,
        public genotype_confirmation:string,
        public phenotype:string,
        public project_title:string,
        public sacrificer:string,
        public purpose:string,
        public comment:string,
        public imageUrl:string,
        public pfa:PFA,
        public freezedown:FreezeDown
    ){ }
}

export class PFA{
   constructor(
       public liver:boolean,
       public liver_tumor:boolean,
       public small_intenstine:boolean,
       public small_intenstine_tumor:boolean,
       public skin:boolean,
       public skin_hair:boolean,
       public other:string
   ){ } 
}

export class FreezeDown{
    constructor(
        public liver:boolean,
        public liver_tumor:boolean,
        public other:string        
    ){ }
}