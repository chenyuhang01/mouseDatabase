import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Mouse, PFA, FreezeDown } from '../model/mouse.component';
import {
    MatTableDataSource,
    MatSort,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
} from '@angular/material';


//Using service getting mouse data from server
import { mouseservice } from '../../services/dataservice/mouseservice.service';

//Json object to csv
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { FormControl } from '@angular/forms';

//Dialog Related module
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogView } from './dialogview/dialogview.component';

import { SelectionModel } from '@angular/cdk/collections';

import { MONTH, ONEDAY } from '../../constants/constants';

@Component({
    selector: 'tableview',
    templateUrl: './tableview.component.html',
    styleUrls: ['./tableview.component.css']
})
export class tableview implements OnInit {

    Math: any;
    ONEDAY: any;
    @Output('insertmouseviewevent') insertmouseviewevent = new EventEmitter<any>();
    @Output('confirmButtonviewevent') confirmButtonviewevent = new EventEmitter<any>();

    //Table Header file
    columnsToDisplay = [
        'Selection',
        'GenoType Confirmation',
        'Physical ID',
        'Mouse Line',
        'Birth Date',
        'Death Date',
        'Age',
        'Gender',
        'Geno Type',
        'PhenoType',
        'Project title',
        'Purpose',
        'Sacrificer',
        'PFA',
        'Freeze Down',

    ];

    //It stores the original columns
    originalColumns = [
        { id: 'select', display: this.columnsToDisplay[0], checked: false },
        { id: 'genotype_confirmation', display: this.columnsToDisplay[1], checked: false },
        { id: 'physical_id', display: this.columnsToDisplay[2], checked: false },
        { id: 'mouseline', display: this.columnsToDisplay[3], checked: false },
        { id: 'birthdate', display: this.columnsToDisplay[4], checked: false },
        { id: 'deathdate', display: this.columnsToDisplay[5], checked: false },
        { id: 'age', display: this.columnsToDisplay[6], checked: false },
        { id: 'gender', display: this.columnsToDisplay[7], checked: false },
        { id: 'genotype', display: this.columnsToDisplay[8], checked: false },
        { id: 'phenotype', display: this.columnsToDisplay[9], checked: false },
        { id: 'projecttitle', display: this.columnsToDisplay[10], checked: false },
        { id: 'purpose', display: this.columnsToDisplay[11], checked: false },
        { id: 'sacrificer', display: this.columnsToDisplay[12], checked: false },
        { id: 'pfa', display: this.columnsToDisplay[13], checked: false },
        { id: 'freezedown', display: this.columnsToDisplay[14], checked: false }
    ]

    //The column to be displayed
    displayedColumns = [

    ];

    //Create datasoucre for mat table
    private dataSource: any;
    private selection = new SelectionModel<Mouse>(true, []);
    //data getting from service
    private datalist: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
        //Getting data from database
        this.mouseDataservice.getData().subscribe((data) => {
            data = data.json();
            this.datalist = data;
            this.jsonToMouse();
            this.dataSource = new MatTableDataSource(this.datalist);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            //Set the custom sorting data method
            this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
                if (sortHeaderId === 'pfa_liver') {
                    return data.pfa.liver;
                }
                if (sortHeaderId === 'freezedown_liver') {
                    return data.freezedown.liver;
                }

                return data[sortHeaderId];
            };
        });

        //Toggles the init columns

        //Toggle Physical ID Columns
        this.ToggleColumns(true, 2);

        //Toogle MouseLine 
        this.ToggleColumns(true, 3);

        //Toogle Geno Type 
        this.ToggleColumns(true, 8);


    }

    constructor(
        private mouseDataservice: mouseservice,
        public dialog: MatDialog) {
            this.Math = Math;
            this.ONEDAY = ONEDAY;
    }


    //convert json data array from server to mouse models in angular 2 web app
    jsonToMouse() {
        this.datalist = this.datalist.map((data) => {
            let pfa: PFA = new PFA(
                data.pfa_liver == 'TRUE' ? true : false,
                data.pfa_liver_tumor == 'TRUE' ? true : false,
                data.pfa_small_intenstine == 'TRUE' ? true : false,
                data.pfa_small_intenstine_tumor == 'TRUE' ? true : false,
                data.pfa_skin == 'TRUE' ? true : false,
                data.pfa_skin_hair == 'TRUE' ? true : false,
                data.pfa_other
            );
            let freezedown: FreezeDown = new FreezeDown(
                data.freezedown_liver == 'TRUE' ? true : false,
                data.freezedown_liver_tumor == 'TRUE' ? true : false,
                data.freezedown_other
            );

            let age = Math.round( Math.abs((new Date(data.deathdate).getTime() - new Date(data.birthdate).getTime())/(ONEDAY)));

            data = new Mouse(
                data.physical_id,
                data.gender,
                data.mouseline,
                new Date(data.birthdate),
                new Date(data.deathdate),
                data.genotype,
                age,
                data.genotype_confirmation,
                data.phenotype,
                data.projecttitle,
                data.sacrificer,
                data.purpose,
                data.comment,
                '',
                pfa,
                freezedown
            );

            return data;
        });
    }

    //Fired when the search input field state changes
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        this.dataSource.filter = filterValue;
    }

    //Buttons Related Method

    private insertmousechecked: boolean = false;
    private insertmousebuttondisplay_opened: string = "Open Insert Mouse panel";
    private insertmousebuttondisplay_closed: string = "Close Insert Mouse panel";

    public closepanel() {
        this.insertmousechecked = !this.insertmousechecked;
    }

    insertmouseview() {
        this.insertmouseviewevent.emit();
        this.insertmousechecked = !this.insertmousechecked;
    }

    export_csv() {
        //convert mouse array data into json data
        let jsonData = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort).map((data: Mouse) => {

            let jsonObject = {
                genotype_confirmation: data.genotype_confirmation,
                physical_id: data.physical_id,
                mouseline: data.mouseline,
                birthdate: data.birthdate.toDateString(),
                deathdate: data.deathdate.toDateString(),
                age: 34,
                gender: data.gender,
                genotype: data.genotype,
                phenotype: data.phenotype,
                projecttitle: data.project_title,
                purpose: data.purpose,
                sacrificer: data.sacrificer,
                pfa_liver: data.pfa.liver,
                pfa_liver_tumor: data.pfa.liver_tumor,
                pfa_small_intenstine: data.pfa.small_intenstine,
                pfa_small_intenstine_tumor: data.pfa.small_intenstine_tumor,
                pfa_skin: data.pfa.skin,
                pfa_skin_hair: data.pfa.skin_hair,
                pfa_other: data.pfa.other,
                freezedown_liver: data.freezedown.liver,
                freezedown_liver_tumor: data.freezedown.liver_tumor,
                freezedown_other: data.freezedown.other
            }

            this.originalColumns.map(data => {
                if (!data.checked) {
                    delete jsonObject[data.id];
                }
            })
            return jsonObject;
        });

        let csv_display_title = this.originalColumns.map((data, index) => {
            if (data.checked) {
                return this.columnsToDisplay[index];
            } else {
                return '';
            }
        }).filter(data => data != '');


        //Using Angular2Csv Module to export the csv file from the filtered table data
        var options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            headers: csv_display_title
        };

        //It will trigger donwload actions
        new Angular2Csv(jsonData, 'Reports', options);
    }
    //CheckBox Related Method

    //This will toggle the speicifc column based on pos
    //Giving null to manulchecked, it will toggle based on current value
    //Else it will force to the given values
    ToggleColumns(manualchecked: boolean, pos: number): void {
        let target = this.originalColumns[pos];
        target.checked = manualchecked != null ? manualchecked : !target.checked;
        //Clear to be display column id
        this.displayedColumns = this.originalColumns.map((data) => {
            if (data.checked) {
                return data.id;
            } else {
                return '';
            }
        }).filter(data => data != '');
    }

    private editButtonenabled: boolean = false;
    private editConfirmbuttonEnabled: boolean = false;
    //Trigger when edit button is pressed
    editbuttonpressed(): void {

        this.ToggleColumns(null, 0);
        this.editButtonenabled = !this.editButtonenabled;
        this.editConfirmbuttonEnabled = !this.editConfirmbuttonEnabled;
        //When CancledEdit is pressed
        if (!this.editButtonenabled) {
            this.selection.clear();

            //Calling editmouseview to add editmousesmallview
            this.confirmButtonviewevent.emit(this.selection.selected);
            this.editConfirmbuttonEnabled = false;

            this.ToggleColumns(false, 0);
        }
    }



    //Triggered when confirm button is pressed
    editConfirmButton(): void {
        this.confirmButtonviewevent.emit(this.selection.selected);
        this.editConfirmbuttonEnabled = !this.editConfirmbuttonEnabled;
        this.ToggleColumns(null, 0);
    }

    public closeEditEnabled() {
        this.selection.clear();
        this.editConfirmbuttonEnabled = false;
        this.editButtonenabled = false;
        this.ToggleColumns(false, 0);
    }


    checkValue(event) {
        let pos = this.columnsToDisplay.indexOf(event.source.id);
        this.ToggleColumns(null, pos);
    }


    //Row related method

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    position = new FormControl('below');
    showDelay = new FormControl(1000);
    selectRow(row) {
        this.openDialog(row);
    }

    openDialog(row): void {
        let dialogRef = this.dialog.open(DialogView, {
            width: '1000px',
            data: { row: row }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}