import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';


interface CheckBoxModel{
    id: string,
    displayname: string
}

@Component({
    selector: 'insertmouseview',
    templateUrl: './insertmouseview.component.html',
    styleUrls: ['./insertmouseview.component.css']
})
export class InsertMouseView{

    @Output('closepanel') closepanelevent = new EventEmitter<any>();

    //Mock group source

    projectTitles: string[] = [
        'AA Project',
        'Hair particles',
        'MouseLine Investigation',
        'BB Project',
        'Delaware'
    ]

    mouselines: string[] = [
        'Lrg5-rrta-GFP',
        'Lrg5-rttA-GFP'
    ]

    genotypes: string[] = [
        'AAAA',
        'BBBB',
        'CCCC'
    ]

    phenotypes: string[] = [
        'AAA',
        'BBB',
        'CCC'
    ]

    //PFA CheckBox model
    pfamodels: CheckBoxModel[] = [
        {id: 'pfa_liver_checkbox', displayname: 'Liver'},
        {id: 'pfa_liver_tumor_checkbox', displayname: 'Liver With Tumor'},
        {id: 'pfa_small_intenstine_checkbox', displayname: 'Small Intenstine'},
        {id: 'pfa_small_intenstine_tumor_checkbox', displayname: 'SMall Intenstine With Tumor'},
        {id: 'pfa_skin_checkbox', displayname: 'Skin'},
        {id: 'pfa_skin_hair_checkbox', displayname: 'Skin With Hair'},
        {id: 'pfa_other_checkbox', displayname: 'Others'}
    ]

    //FreezeDown Model
    freezedownmodels: CheckBoxModel[] = [
        {id: 'freeze_down_liver_checkbox', displayname: 'Liver'},
        {id: 'freeze_down_liver_tumor_checkbox', displayname: 'Liver With Tumor'},
        {id: 'freeze_down_other_checkbox', displayname: 'Others'}
    ]

    constructor(
        public snackBar: MatSnackBar,
        private bottomSheet: MatBottomSheet,
        private fb: FormBuilder
    ) { }

    open(): void {
        let snackBarRef = this.snackBar.open(
            'Inserting now...',
            'Dismiss',
            {
                duration: 2000
            });
    }

    openBottomSheet(): void {
        this.bottomSheet.open(BottomMenu);
    }

    closepanel(): void {
        this.closepanelevent.emit();
    }


    /* Retrieved Date Data */
    private birthDate: Date;
    private deathDate: Date;

    /* Date related callbacks */
    dateTrigger(event, result){
        if(result.targetElement.id == "birthdatepicker"){
            this.birthDate = result.value;
        }else{
            this.deathDate = result.value;
        }
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