import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef, MatListModule, MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface ProjectTitle {
    person: string;
    ProjectTitle: string[];
}

@Component({
    selector: 'insertmouseview',
    templateUrl: './insertmouseview.component.html',
    styleUrls: ['./insertmouseview.component.css']
})
export class InsertMouseView implements OnInit {

    @Output('closepanel') closepanelevent = new EventEmitter<any>();

    //Mock group source
    projectGroups: ProjectTitle[] = [{
        person: 'Shih Han',
        ProjectTitle: ['AA Project', 'Hair particles']
    }, {
        person: 'Hui San',
        ProjectTitle: ['MouseLine Investigation', 'BB Project']
    }, {
        person: 'Alex',
        ProjectTitle: ['Delaware']
    }]

    projectGroupOptions: Observable<ProjectTitle[]>;

    projectForm: FormGroup = this.fb.group({
        projectGroup: '',
    });

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

    closepanel(): void{
        this.closepanelevent.emit();
    }

    ngOnInit() {
        this.projectGroupOptions = this.projectForm.get('projectGroup')!.valueChanges
            .pipe(
                startWith(''),
                map(val => this.filterGroup(val))
            );
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