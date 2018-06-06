import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Mouse } from '../../model/mouse.component';
@Component({
    selector: 'editmousesmallview',
    templateUrl: './editmousesmallview.component.html',
    styleUrls: ['./editmousesmallview.component.css']
})
export class EditMouseViewSmall {


    //Mock group source
    projectTitles: string[] = [
        'AA Project',
        'Hair particles',
        'MouseLine Investigation',
        'BB Project',
        'Delaware'
    ]

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

    ngOnInit() {

        this.prePhysicalID = this.mouse.physical_id;
        this.preProjectTitle = new FormControl(this.mouse.project_title);
        this.preGender = new FormControl(this.mouse.gender);
        this.preMouseLine = new FormControl(this.mouse.mouseline);
        this.preReason = 'Testing Reason';

       
    }

    @Output('cancelevent') cancelevent = new EventEmitter<any>();
    cancelButtonClicked(){
        this.cancelevent.emit(this.index);
    }
}