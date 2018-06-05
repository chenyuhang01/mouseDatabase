export class Mouse{
    constructor(
        public physical_id:string,
        public project_title:string,
        public gender:string,
        public mouseline:string,
        public imageUrl:string,
        // public genotype:string,
        // public genotype_confirmation:string,
        // public phenotype:string,
        // public sacrificer:string,
        // public birthdate:string,
        // public deathdate:string,
        // public reason:string,
        // public comment:string,
        public pfa:PFA,
        public freezedown:FreezeDown
    ){ }
}

export class PFA{
   constructor(
       public liver:string,
    //    public liver_tumor:string,
    //    public small_intenstine:string,
    //    public small_intenstin_tumor:string,
    //    public skin:string,
    //    public skin_hair:string,
    //    public other:string
   ){ } 
}

export class FreezeDown{
    constructor(
        public liver:string,
        // public liver_tumor:string,
        // public other:string        
    ){ }
}