import { Component, OnInit, Output, EventEmitter, AfterViewInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';


import { categoryservice } from '../../services/dataservice/categoryservice.service';
import { mouseservice } from '../../services/dataservice/mouseservice.service';
import { NotificationService } from '../../services/notificationservice/notification.service';

@Component({
    selector: 'insertmouseview',
    templateUrl: './insertmouseview.component.html',
    styleUrls: ['./insertmouseview.component.css']
})
export class InsertMouseView implements OnInit {

    @Output('closepanel') closepanelevent = new EventEmitter<any>();
    @Output('insertSuccessEvent') insertSuccessEvent = new EventEmitter<any>();

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
        private mouseserviceHandler: mouseservice,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        //Get Category data
        this.getCategoryData(true);

    }

    public getCategoryData(beforeCreated: boolean) {
        //Getting categories from server and initialize all the selection models


        this.categoryserviceHandler.getData().subscribe((data) => {
            let data_json = data;

            let error: boolean = data_json.error;
            let errorCode: number = data_json.errorCode;

            this.projectTitles = data_json.result.project_titles;
            this.mouselines = data_json.result.mouselines;
            this.genotypes = data_json.result.genotypes;
            this.phenotypes = data_json.result.phenotypes;
            this.sacrificers = data_json.result.sacrificers;

            //MatSnackBar
            this.notificationService.toast(
                'Fetching Catelog Data Completed',
                false
            );
        })
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
            this.birthDate.setDate(result.value);
        } else {
            this.deathDate.setDate(result.value);
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

    check_field_empty() {

        let field_array: any[] = [
            {
                name: 'Physical ID',
                value: this.physical_id_inputs
            },
            {
                name: 'Gender',
                value: this.gender_select
            },
            {
                name: 'Mouse Line',
                value: this.mouseline_select
            },
            {
                name: 'Geno Type',
                value: this.genotype_select
            },
            {
                name: 'Geno Type Confirmation',
                value: this.genotype_confirmation
            },
            {
                name: 'Pheno Type',
                value: this.phenotype_select
            },
            {
                name: 'Project Title',
                value: this.project_title_select
            },
            {
                name: 'Sacrificer',
                value: this.sacrificer_select
            },
            {
                name: 'BirthDate',
                value: this.birthDate
            },
            {
                name: 'DeathDate',
                value: this.deathDate
            }
            // {
            //     name: 'PFA Fields',
            //     value:
            //         this.pfa_liver_checkbox ||
            //         this.pfa_liver_tumor_checkbox ||
            //         this.pfa_small_intenstine_checkbox ||
            //         this.pfa_small_intenstine_tumor_checkbox ||
            //         this.pfa_skin_checkbox ||
            //         this.pfa_skin_hair_checkbox ||
            //         this.pfa_other_string !== ''
            // },
            // {
            //     name: 'FreezeDown Fields',
            //     value:
            //         this.freeze_down_liver_checkbox ||
            //         this.freeze_down_liver_tumor_checkbox ||
            //         this.freeze_down_other_string !== ''
            // }
        ]

        let error_message = '';
        let error: boolean = false;
        field_array.map(data => {

            if (data.name === "PFA Fields") {
                if (!data.value) {
                    error = error || true;
                    error_message += data.name + ' cannot be empty.';
                }
            } else if (data.name === "FreezeDown Fields") {
                if (!data.value) {
                    error = error || true;
                    error_message += data.name + ' cannot be empty.';
                }
            } else if (data.name === 'BirthDate' || data.name === 'DeathDate') {
                if (data.value == null) {
                    error = error || true;
                    error_message += data.name + ' cannot be empty.';
                }
            }
            else {
                if (data.value === '') {
                    error = error || true;
                    error_message += data.name + ' cannot be empty.';
                }

            }

        })

        return {
            error_message: error_message,
            error: error
        }
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

        let error_event = this.check_field_empty();

        if (error_event.error) {
            let error_message_lists: string[] = error_event.error_message.split(".");

            let errordata = {
                error_code: 6,
                error_message: error_message_lists
            }
            this.notificationService.toast(
                errordata,
                true
            );

            return;
        }

        this.notificationService.toast(
            "Inserting now...",
            false
        )

        this.mouseserviceHandler.insertData(jsonObject).subscribe(
            (event) => {
                let error: boolean = event.error;
                let errorCode: string = event.errorCode;
                let result: string = event.result;

                if (error) {

                    let error_message_lists: string[] = result.split(".");

                    let errordata = {
                        error_code: errorCode,
                        error_message: error_message_lists
                    }
                    this.notificationService.toast(
                        errordata,
                        true
                    )
                } else {
                    this.notificationService.toast(
                        result,
                        false
                    )
                    this.clearAllInputs();
                    this.insertSuccessEvent.emit();
                }

            }
        )


    }

    insert_wo_ButtonPressed(event) {
        let jsonObject = this.getJsonObject();

        let error_event = this.check_field_empty();

        if (error_event.error) {
            let error_message_lists: string[] = error_event.error_message.split(".");

            let errordata = {
                error_code: 6,
                error_message: error_message_lists
            }
            this.notificationService.toast(
                errordata,
                true
            );

            return;
        }

        this.notificationService.toast(
            "Inserting now...",
            false
        )

        this.mouseserviceHandler.insertData(jsonObject).subscribe(
            (event) => {
                let error: boolean = event.error;
                let errorCode: string = event.errorCode;
                let result: string = event.result;

                if (error) {

                    let error_message_lists: string[] = result.split(".");

                    let errordata = {
                        error_code: errorCode,
                        error_message: error_message_lists
                    }
                    this.notificationService.toast(
                        errordata,
                        true
                    )
                } else {
                    this.notificationService.toast(
                        result,
                        false
                    )
                    this.insertSuccessEvent.emit();
                }

            }
        )
    }

    clearButtonPressed(event) {
        console.log('clear button pressed');
        this.clearAllInputs();
    }
}



/* Bottom Sheet Component */
@Component({
    selector: 'bottomsheet',
    templateUrl: './bottomsheetview/bottomsheetview.component.html',
    styleUrls: ['./bottomsheetview/bottomsheetview.component.css']
})
export class BottomMenu {


    private mouseline_cat_input: string = "";
    private genotype_cat_input: string = "";
    private phenotype_cat_input: string = "";
    private sacrificer_cat_input: string = "";
    private project_title_cat_input: string = "";

    constructor(
        private notificationService: NotificationService,
        private bottomSheetRef: MatBottomSheetRef<BottomMenu>,
        private dataservice: categoryservice) { }

    //Trigger sendRequest event when buttons are clicked
    sendRequest(event): void {
        let id = event.target.id || event.srcElement.id || event.currentTarget.id;


        //this.makesnackBar(null, null, 'Inserting now..', 0);

        let error_message: string;
        switch (id) {
            case "mouseline":
                this.SendToServerWithCheck("mouseline", this.mouseline_cat_input);
                break;
            case "genotype":
                this.SendToServerWithCheck("genotype", this.genotype_cat_input);
                break;
            case "phenotype":
                this.SendToServerWithCheck("phenotype", this.phenotype_cat_input);
                break;
            case "sacrificer":
                this.SendToServerWithCheck("sacrificer", this.sacrificer_cat_input);
                break;
            case "project_title":
                this.SendToServerWithCheck("project_title", this.project_title_cat_input);
                break;
        }

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
            let messageLists: string[] = []

            messageLists.push(message);
            let errordata = {
                error_code: errorCode,
                error_message: messageLists
            }

            if (error) {
                this.notificationService.toast(
                    errordata,
                    true
                );
            } else {
                this.notificationService.toast(
                    message,
                    false
                );
                //Clear input
                this.clearall();
            }

        });
    }

    check_field_empty(key, inputs) {
        if (inputs === "") {
            let error_message = this.keyToDisplayName(key) + ' cannot be empty.';
            return error_message;
        } else {
            return '';
        }
    }

    keyToDisplayName(key) {
        if (key == "mouseline") {
            return "Mouse Line ";
        } else if (key == "genotype") {
            return "Geno Type";
        } else if (key == "phenotype") {
            return "PhenoType";
        } else if (key == "sacrificer") {
            return "Sacrificer";
        } else if (key == "project_title") {
            return "Project Title";
        }
    }

    SendToServerWithCheck(key, the_input_string) {
        let error_message = this.check_field_empty(key, the_input_string);

        if (error_message === '') {
            this.notificationService.toast(
                'Inserting now..',
                false
            );
            this.sendAddRequest(key, the_input_string);
        } else {
            let error_message_lists: string[] = [];
            error_message_lists.push(error_message);
            let errordata = {
                error_code: 7,
                error_message: error_message_lists
            }
            this.notificationService.toast(
                errordata,
                true
            )
        }

    }
}   