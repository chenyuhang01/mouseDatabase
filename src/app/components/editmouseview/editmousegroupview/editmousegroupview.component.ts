import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { ProjectTitle } from '../../insertmouseview/insertmouseview.component';
import { Mouse } from '../../model/mouse.component';


interface Record{
    parameter: string;
    edited: boolean;       
}

@Component({
    selector: 'editmousegroupview',
    templateUrl: './editmousegroupview.component.html',
    styleUrls: ['./editmousegroupview.component.css']
})
export class EditMouseViewGroup {


    //Mock group source
    projectGroups: ProjectTitle[] = [{
        person: 'Shih Han',
        ProjectTitle: ['AA Project', 'Hair particles', 'A']
    }, {
        person: 'Hui San',
        ProjectTitle: ['MouseLine Investigation', 'BB Project']
    }, {
        person: 'Alex',
        ProjectTitle: ['Delaware']
    }]

    projectGroupOptions: Observable<ProjectTitle[]>;

    projectForm: FormGroup = this.fb.group({
        projectGroup: ''
    });


    constructor(
        public snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet,
        private fb: FormBuilder
    ) {

    }

    

    @Input() mouse: Mouse;
    @Input() index: number;
    
    private prePhysicalID: string;
    private preProjectTitle: FormControl;
    private preGender: FormControl;
    private preMouseLine: FormControl;
    private preReason: string;
    private newValuechosen: boolean = false;




    private recordEditTracker: Record[] = [
        {
            parameter: 'gender',
            edited: false
        },
        {
            parameter: 'project_title',
            edited: false
        },
        {
            parameter: 'mouseline',
            edited: false
        },
        {
            parameter: 'pfa_liver',
            edited: false
        },
        {
            parameter: 'freezedown_liver',
            edited: false
        }    
    ]

    ngOnInit() {
        this.projectGroupOptions = this.projectForm.get('projectGroup')!.valueChanges
            .pipe(
                startWith(''),
                map(val => this.filterGroup(val))
            );
            this.prePhysicalID = '';
            this.preProjectTitle = new FormControl('');
            this.preGender = new FormControl('');
            this.preMouseLine = new FormControl('');
            this.preReason = '';
    }

    filterGroup(val: string): ProjectTitle[] {
        if (val) {
            return this.projectGroups
                .map(group => ({ person: group.person, ProjectTitle: this._filter(group.ProjectTitle, val) }))
                .filter(group => group.ProjectTitle.length > 0);
        }

        return this.projectGroups;
    }

    private _filter(opt: string[], val: string) {
        const filterValue = val.toLowerCase();
        return opt.filter(item => item.toLowerCase().startsWith(filterValue));
    }

    @Output('cancelevent') cancelevent = new EventEmitter<any>();
    cancelButtonClicked(){
        this.cancelevent.emit(this.index);
    }

    /* Group Handler */
    onValueChanged(event){

        this.recordEditTracker.map(record => {
            if(record.parameter == event.source.id){
                record.edited = true;
            }
        })
    }
}