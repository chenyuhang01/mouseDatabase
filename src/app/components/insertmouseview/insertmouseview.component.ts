import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


import { categoryservice } from '../../services/dataservice/categoryservice.service';
import { mouseservice } from '../../services/dataservice/mouseservice.service';

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

    private physical_id_inputs: string = '';
    private mouseline_select: string = '';
    private gender_select: string = '';
    private genotype_select: string = '';
    private genotype_confirmation: string = '';
    private phenotype_select: string = '';
    private project_title_select: string = '';
    private sacrificer_select: string = '';
    private purpose_textarea: string = '';
    private comment_textarea: string = '';

    /* Retrieved Date Data */
    private birthDate: Date;
    private deathDate: Date;

    /* Retrieved PFA Data */
    private pfa_liver_checkbox: boolean = false;
    private pfa_liver_tumor_checkbox: boolean = false;
    private pfa_small_intenstine_checkbox: boolean = false;
    private pfa_small_intenstine_tumor_checkbox: boolean = false;
    private pfa_skin_checkbox: boolean = false;
    private pfa_skin_hair_checkbox: boolean = false;
    private pfa_other_checkbox: boolean = false;
    private pfa_other_string: string = '';

    /* Retrieved FreezeDown Data */
    private freeze_down_liver_checkbox: boolean = false;
    private freeze_down_liver_tumor_checkbox: boolean = false;
    private freeze_down_other_checkbox: boolean = false;
    private freeze_down_other_string: string = '';

    //Category datasource
    projectTitles: string[] = [];
    mouselines: string[] = [];
    genotypes: string[] = [];
    phenotypes: string[] = [];
    sacrificers: string[] = [];

    constructor(
        private snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet,
        private categoryserviceHandler: categoryservice,
        private mouseserviceHandler: mouseservice
    ) { }

    ngOnInit() {
        //Get Category data
        this.getCategoryData(true);
    }

    public getCategoryData(beforeCreated: boolean) {
        //Getting categories from server and initialize all the selection models
        if (!beforeCreated) {
            this.open("Fetching Catelog Data...", 0);
        }

        this.categoryserviceHandler.getData().subscribe((data) => {
            let data_json = data;

            let error: boolean = data_json.error;
            let errorCode: number = data_json.errorCode;

            this.projectTitles = data_json.result.project_titles;
            this.mouselines = data_json.result.mouselines;
            this.genotypes = data_json.result.genotypes;
            this.phenotypes = data_json.result.phenotypes;
            this.sacrificers = data_json.result.sacrificers;

            this.open("Fetching Catelog Data Completed", 2000);
        })
    }

    //Used to open the snackbar
    open(message: string, duration: number): void {
        if (duration == 0) {
            let snackBarRef = this.snackBar.open(
                message);
        } else {
            let snackBarRef = this.snackBar.open(
                message,
                'Dismiss',
                {
                    duration: duration
                });
        }

    }

    //Open buttom sheet
    openBottomSheet(): void {
        const refToBottomSheet = this.bottomSheet.open(BottomMenu);
        refToBottomSheet.afterDismissed().subscribe(() => {
            //Get Category data
            this.getCategoryData(false);
        });
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


    getJsonObject() {
        let jsonObject = {
            physical_id: this.physical_id_inputs,
            mouseline: this.mouseline_select,
            gender: this.gender_select,
            genotype: this.genotype_select,
            genotype_confirmation: this.genotype_confirmation,
            phenotype: this.phenotype_select,
            project_title: this.project_title_select,
            sacrificer: this.sacrificer_select,
            purpose: this.purpose_textarea,
            comment: this.comment_textarea,
            birthdate: this.birthDate ? this.birthDate.toLocaleDateString("en-sg") : '',
            deathdate: this.deathDate ? this.deathDate.toLocaleDateString("en-sg") : '',
            pfa: {
                liver: this.pfa_liver_checkbox,
                liver_tumor: this.pfa_liver_tumor_checkbox,
                small_intenstine: this.pfa_small_intenstine_checkbox,
                small_intenstine_tumor: this.pfa_small_intenstine_tumor_checkbox,
                skin: this.pfa_skin_checkbox,
                skin_hair: this.pfa_skin_hair_checkbox,
                other: this.pfa_other_checkbox ? this.pfa_other_string : ''
            },
            freezedown: {
                liver: this.freeze_down_liver_checkbox,
                liver_tumor: this.freeze_down_liver_tumor_checkbox,
                other: this.freeze_down_other_checkbox ? this.freeze_down_other_string : ''
            }
        }

        return jsonObject;
    }

    clearAllInputs() {
        //Clear all inputs
        this.physical_id_inputs = '';
        this.mouseline_select = '';
        this.gender_select = '';
        this.genotype_select = '';
        this.genotype_confirmation = '';
        this.phenotype_select = '';
        this.project_title_select = '';
        this.sacrificer_select = '';
        this.purpose_textarea = '';
        this.comment_textarea = '';

        //Clear all the inputs checkbox
        this.pfa_liver_checkbox = false;
        this.pfa_liver_tumor_checkbox = false;
        this.pfa_small_intenstine_checkbox = false;
        this.pfa_small_intenstine_tumor_checkbox = false;
        this.pfa_skin_checkbox = false;
        this.pfa_skin_hair_checkbox = false;
        this.pfa_other_checkbox = false;
        this.pfa_other_string = '';

        /* Retrieved FreezeDown Data */
        this.freeze_down_liver_checkbox = false;
        this.freeze_down_liver_tumor_checkbox = false;
        this.freeze_down_other_checkbox = false;
        this.freeze_down_other_string = '';
    }


    /* Callback methods for all the buttons */
    insertButtonPressed(event) {
        console.log('Insert button pressed');
        let jsonObject = this.getJsonObject();

        this.mouseserviceHandler.insertData(jsonObject).subscribe(
            (event) => {
                console.log(event);
            }
        )

        this.clearAllInputs();
    }

    insert_wo_ButtonPressed(event) {
        console.log('Insert without clear button pressed');
        let jsonObject = this.getJsonObject();
    }

    clearButtonPressed(event) {
        console.log('clear button pressed');
        this.clearAllInputs();
    }
}

@Component({
    selector: 'bottomsheet',
    templateUrl: './bottomsheetview/bottomsheetview.component.html',
    styleUrls: ['./bottomsheetview/bottomsheetview.component.css']
})
export class BottomMenu {


    private mouseline_cat_input: string;
    private genotype_cat_input: string;
    private phenotype_cat_input: string;
    private sacrificer_cat_input: string;
    private project_title_cat_input: string;
    private insertmouseview: InsertMouseView;

    constructor(
        public snackBar: MatSnackBar,
        private bottomSheetRef: MatBottomSheetRef<BottomMenu>,
        private dataservice: categoryservice) { }

    //Trigger sendRequest event when buttons are clicked
    sendRequest(event): void {
        console.log(event);
        let id = event.target.id || event.srcElement.id || event.currentTarget.id;

        this.makesnackBar(null, null, 'Inserting now..', 0);

        switch (id) {
            case "mouseline":
                console.log(this.mouseline_cat_input);
                this.sendAddRequest("mouseline", this.mouseline_cat_input);
                break;
            case "genotype":
                console.log(this.genotype_cat_input);
                this.sendAddRequest("genotype", this.genotype_cat_input);
                break;
            case "phenotype":
                console.log(this.phenotype_cat_input);
                this.sendAddRequest("phenotype", this.phenotype_cat_input);
                break;
            case "sacrificer":
                console.log(this.sacrificer_cat_input);
                this.sendAddRequest("sacrificer", this.sacrificer_cat_input);
                break;
            case "project_title":
                console.log(this.project_title_cat_input);
                this.sendAddRequest("project_title", this.project_title_cat_input);
                break;
        }
        //Clear input
        this.clearall();
    }

    //Clear all the inputs
    clearall() {
        this.mouseline_cat_input = '';
        this.genotype_cat_input = '';
        this.phenotype_cat_input = '';
        this.sacrificer_cat_input = '';
        this.project_title_cat_input = '';
    }

    //Send Request to server
    sendAddRequest(type, input) {
        this.dataservice.insertData(type, input).subscribe((event) => {
            let errorCode = event.errorCode;
            let error = event.error;
            let message = event.result;

            this.makesnackBar(errorCode, error, message, 3000);
        });
    }

    makesnackBar(errorCode: number, error: boolean, message: string, duration: number) {

        if (duration == 0) {
            let snackBarRef = this.snackBar.open(
                message,
                'Dismiss');
        } else {

            let displaymessage: string = error ? 'Error Occurs: ' + errorCode : message;

            let snackBarRef = this.snackBar.open(
                displaymessage,
                'Dismiss',
                {
                    duration: duration
                });
        }
    }
}