import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { categoryservice } from '../../../services/dataservice/categoryservice.service';
import { NotificationService } from '../../../services/notificationservice/notification.service';
import { mouseservice } from '../../../services/dataservice/mouseservice.service';
import { FormControl } from '@angular/forms';
import { Mouse } from '../../model/mouse.component';

import { FileUploader } from '../../../services/dataservice/fileuploader.service';

@Component({
    selector: 'editmousesmallview',
    templateUrl: './editmousesmallview.component.html',
    styleUrls: ['./editmousesmallview.component.css']
})
export class EditMouseViewSmall implements OnInit {


    @Input() mouse: Mouse;
    @Input() index: number;

    @Output('cancelevent') cancelevent = new EventEmitter<any>();
    @Output('updatefinishedEvent') updatefinishedEvent = new EventEmitter<any>();
    @Output('importImageevent') importImageevent = new EventEmitter<any>();

    @ViewChild('imagefileInput') imagefileInput: ElementRef;

    //Category datasource
    projectTitles: string[] = [];
    mouselines: string[] = [];
    genotypes: string[] = [];
    phenotypes: string[] = [];
    sacrificers: string[] = [];

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
    private birthDate: FormControl;
    private deathDate: FormControl;

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

    constructor(
        private categoryservicehandler: categoryservice,
        private notificationService: NotificationService,
        private mouseservicehandler: mouseservice,
        private fileuploader: FileUploader
    ) { }

    ngOnInit() {
        //Get Category data
        this.getCategoryData();
        this.fillUpPredata();
    }

    fillUpPredata() {
        this.physical_id_inputs = this.mouse.physical_id;
        this.mouseline_select = this.mouse.mouseline;
        this.gender_select = this.mouse.gender;
        this.genotype_select = this.mouse.genotype;
        this.genotype_confirmation = this.mouse.genotype_confirmation;
        this.phenotype_select = this.mouse.phenotype;
        this.project_title_select = this.mouse.project_title;
        this.sacrificer_select = this.mouse.sacrificer;
        this.purpose_textarea = this.mouse.purpose;
        this.comment_textarea = this.mouse.comment;
        this.birthDate = new FormControl(this.mouse.birthdate);
        this.deathDate = new FormControl(this.mouse.deathdate);
        this.pfa_liver_checkbox = this.mouse.pfa.liver;
        this.pfa_liver_tumor_checkbox = this.mouse.pfa.liver_tumor;
        this.pfa_small_intenstine_checkbox = this.mouse.pfa.small_intenstine;
        this.pfa_small_intenstine_tumor_checkbox = this.mouse.pfa.small_intenstine_tumor;
        this.pfa_skin_checkbox = this.mouse.pfa.skin;
        this.pfa_skin_hair_checkbox = this.mouse.pfa.skin_hair;
        if (this.mouse.pfa.other != "") {
            this.pfa_other_checkbox = true;
            this.pfa_other_string = this.mouse.pfa.other;
        }
        this.freeze_down_liver_checkbox = this.mouse.freezedown.liver;
        this.freeze_down_liver_tumor_checkbox = this.mouse.freezedown.liver_tumor;
        if (this.mouse.freezedown.other != "") {
            this.freeze_down_other_checkbox = true;
            this.freeze_down_other_string = this.mouse.freezedown.other;
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
            birthdate: this.birthDate.value.toLocaleDateString("en-sg"),
            deathdate: this.deathDate.value.toLocaleDateString("en-sg"),
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
                value: this.birthDate.value
            },
            {
                name: 'DeathDate',
                value: this.deathDate.value
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

    /* Date related callbacks */
    dateTrigger(event, result) {
        if (result.targetElement.id == "birthdatepicker") {
            this.birthDate.setValue(result.value);
        } else {
            this.deathDate.setValue(result.value);
        }
    }

    public getCategoryData() {

        this.categoryservicehandler.getData().subscribe((data) => {
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

    updateButtonClicked(){
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

        let jsonObject = this.getJsonObject();

        this.mouseservicehandler.updateData(jsonObject).subscribe(
            event => {
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
                    this.cancelevent.emit(this.index);
                    this.updatefinishedEvent.emit();
                }
            }
        )

        

    }

    onFileChange(event){
        this.fileuploader.addFiles(event.target.files);
        this.importImageevent.emit(this.mouse.physical_id);
    }

    UploadImage(){
        this.imagefileInput.nativeElement.click();
    }

    cancelButtonClicked() {
        this.cancelevent.emit(this.index);
    }
}