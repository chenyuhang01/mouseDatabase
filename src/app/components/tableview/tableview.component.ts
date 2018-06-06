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

@Component({
    selector: 'tableview',
    templateUrl: './tableview.component.html',
    styleUrls: ['./tableview.component.css']
})
export class tableview implements OnInit {

    @Output('insertmouseviewevent') insertmouseviewevent = new EventEmitter<any>();
    @Output('confirmButtonviewevent') confirmButtonviewevent = new EventEmitter<any>();

    //Table Header file
    columnsToDisplay = [
        'Selection',
        'Physical ID',
        'Project title',
        'Gender',
        'Mouse Line',
        'PFA Liver',
        'FreezeDown Liver'
    ];

    //It stores the original columns
    originalColumns = [
        { id: 'select', checked: false },
        { id: 'physical_id', checked: true },
        { id: 'project_title', checked: true },
        { id: 'gender', checked: true },
        { id: 'mouseline', checked: true },
        { id: 'pfa_liver', checked: true },
        { id: 'freezedown_liver', checked: true },
    ]

    //The column to be displayed
    displayedColumns = [
        'physical_id',
        'project_title',
        'gender',
        'mouseline',
        'pfa_liver',
        'freezedown_liver'
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
    }

    constructor(
        private mouseDataservice: mouseservice,
        public dialog: MatDialog) {

    }


    //convert json data array from server to mouse models in angular 2 web app
    jsonToMouse() {
        this.datalist = this.datalist.map((data) => {
            let pfa: PFA = new PFA(data.pfa_liver);
            let freezedown: FreezeDown = new FreezeDown(data.freezedown_liver);

            data = new Mouse(
                data.physical_id,
                data.project_title,
                data.gender,
                data.mouseline,
                '',
                pfa,
                freezedown);

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
        let jsonData = this.dataSource.filteredData.map((data: Mouse) => {

            let jsonObject = {
                physical_id: data.physical_id,
                project_title: data.project_title,
                gender: data.gender,
                mouseline: data.mouseline,
                pfa_liver: data.pfa.liver,
                freezedown_liver: data.freezedown.liver
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

        console.log(csv_display_title);

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
            width: '800px',
            data: { row: row }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}