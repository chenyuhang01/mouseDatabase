import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


import { categoryservice } from '../../services/dataservice/categoryservice.service';

interface CheckBoxModel {
    id: boolean,
    displayname: string
}

@Component({
    selector: 'insertmouseview',
    templateUrl: './insertmouseview.component.html',
    styleUrls: ['./insertmouseview.component.css']
})
export class InsertMouseView implements OnInit {

    @Output('closepanel') closepanelevent = new EventEmitter<any>();


    /* Retrieved data section */

    private physical_id_inputs:string;
    private mouseline_select:string;
    private gender_select:string;
    private genotype_select:string;
    private phenotype_select:string;
    private project_title_select:string;
    private sacrificer_select:string;
    private purpose_textarea:string;
    private comment_textarea:string;
    
    /* Retrieved Date Data */
    private birthDate: Date;
    private deathDate: Date;

    /* Retrieved PFA Data */
    private pfa_liver_checkbox: boolean;
    private pfa_liver_tumor_checkbox: boolean;
    private pfa_small_intenstine_checkbox: boolean;
    private pfa_small_intenstine_tumor_checkbox: boolean;
    private pfa_skin_checkbox: boolean;
    private pfa_skin_hair_checkbox: boolean;
    private pfa_other_checkbox: boolean;

    /* Retrieved FreezeDown Data */
    private freeze_down_liver_checkbox: boolean;
    private freeze_down_liver_tumor_checkbox: boolean;
    private freeze_down_other_checkbox: boolean;


    //Category datasource
    projectTitles: string[] = [];
    mouselines: string[] = [];
    genotypes: string[] = [];
    phenotypes: string[] = [];
    sacrificers: string[] = [];

    //PFA CheckBox model
    pfamodels: CheckBoxModel[] = [
        { id: this.pfa_liver_checkbox, displayname: 'Liver' },
        { id: this.pfa_liver_tumor_checkbox, displayname: 'Liver With Tumor' },
        { id: this.pfa_small_intenstine_checkbox, displayname: 'Small Intenstine' },
        { id: this.pfa_small_intenstine_tumor_checkbox, displayname: 'SMall Intenstine With Tumor' },
        { id: this.pfa_skin_checkbox, displayname: 'Skin' },
        { id: this.pfa_skin_hair_checkbox, displayname: 'Skin With Hair' },
        { id: this.pfa_other_checkbox, displayname: 'Others' }
    ]

    //FreezeDown Model
    freezedownmodels: CheckBoxModel[] = [
        { id: this.freeze_down_liver_checkbox, displayname: 'Liver' },
        { id: this.freeze_down_liver_tumor_checkbox, displayname: 'Liver With Tumor' },
        { id: this.freeze_down_other_checkbox, displayname: 'Others' }
    ]


    constructor(
        private snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet,
        private categoryserviceHandler: categoryservice
    ) { }

    ngOnInit() {

        //Getting categories from server and initialize all the selection models
        this.categoryserviceHandler.getData().subscribe((data) => {
            let data_json = data.json();
            console.log(data_json);
            this.projectTitles = data_json.projecttitle;
            this.mouselines = data_json.mouseline;
            this.genotypes = data_json.genotype;
            this.phenotypes = data_json.phenotype;
            this.sacrificers = data_json.sacrificer;
        })
    }

    //Used to open the snackbar
    open(): void {
        let snackBarRef = this.snackBar.open(
            'Inserting now...',
            'Dismiss',
            {
                duration: 2000
            });
    }

    //Open buttom sheet
    openBottomSheet(): void {
        this.bottomSheet.open(BottomMenu);
    }

    //Emits the close panel event out of this insert mouse component
    closepanel(): void {
        this.closepanelevent.emit();
    }


    /* Date related callbacks */
    dateTrigger(event, result) {
        if (result.targetElement.id == "birthdatepicker") {
            this.birthDate = result.value;
        } else {
            this.deathDate = result.value;
        }
    }
    
    ButtonHandler(event):void{
        event.preventDefault();
        let id = event.srcElement.id;

        switch(id){
            case 'insert':
                this.insertButtonPressed();
                break;
            case 'insert_wo_clear':
                this.insert_wo_ButtonPressed();
                break;
            case 'clear':
                this.clearButtonPressed();
                break;
        }
    }

    insertButtonPressed(){
        console.log('Insert button pressed');
    }

    insert_wo_ButtonPressed(){
        console.log('Insert withou clear button pressed');
    }

    clearButtonPressed(){
        console.log('clear button pressed');
    }
}

@Component({
    selector: 'bottomsheet',
    templateUrl: './bottomsheetview/bottomsheetview.component.html',
    styleUrls: ['./bottomsheetview/bottomsheetview.component.css']
})
export class BottomMenu {
    constructor(
        public snackBar: MatSnackBar,
        private bottomSheetRef: MatBottomSheetRef<BottomMenu>) { }

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

    open(): void {
        let snackBarRef = this.snackBar.open(
            'Inserting now...',
            'Dismiss',
            {
                duration: 2000
            });
    }

}