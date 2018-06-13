import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Inject } from '@angular/core';
import { Mouse, PFA, FreezeDown } from '../model/mouse.component';
import {
    MatTableDataSource,
    MatSort,
    MatPaginator,
    MatSnackBar
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

import { NotificationService } from '../../services/notificationservice/notification.service';
import { FileUploader } from '../../services/dataservice/fileuploader.service';

import { FileInterface } from '../model/file';

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

    
    @Output('importcsvevent') importcsvevent = new EventEmitter<any>();

    @ViewChild('csvfileInput') csvfileInput: ElementRef;

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
        'Detail'
    ];

    //It stores the original columns
    originalColumns = [
        { id: 'select', pos: -1, display: this.columnsToDisplay[0], checked: false },
        { id: 'genotype_confirmation', pos: 0, display: this.columnsToDisplay[1], checked: false },
        { id: 'physical_id', pos: 1, display: this.columnsToDisplay[2], checked: false },
        { id: 'mouseline', pos: 2, display: this.columnsToDisplay[3], checked: false },
        { id: 'birthdate', pos: 3, display: this.columnsToDisplay[4], checked: false },
        { id: 'deathdate', pos: 4, display: this.columnsToDisplay[5], checked: false },
        { id: 'age', pos: 5, display: this.columnsToDisplay[6], checked: false },
        { id: 'gender', pos: 6, display: this.columnsToDisplay[7], checked: false },
        { id: 'genotype', pos: 7, display: this.columnsToDisplay[8], checked: false },
        { id: 'phenotype', pos: 8, display: this.columnsToDisplay[9], checked: false },
        { id: 'projecttitle', pos: 9, display: this.columnsToDisplay[10], checked: false },
        { id: 'purpose', pos: 10, display: this.columnsToDisplay[11], checked: false },
        { id: 'sacrificer', pos: 11, display: this.columnsToDisplay[12], checked: false },
        { id: 'pfa', pos: 12, display: this.columnsToDisplay[13], checked: false },
        { id: 'freezedown', pos: 13, display: this.columnsToDisplay[14], checked: false },
        { id: 'detail', pos: -1, display: this.columnsToDisplay[15], checked: false }
    ]

    //The column to be displayed
    displayedColumns = [

    ];

    //Create datasoucre for mat table
    private dataSource: MatTableDataSource<Mouse>;
    private selection = new SelectionModel<Mouse>(true, []);
    //data getting from service
    private datalist: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
        this.Init();

        //Toggles the init columns

        //Toggle Physical ID Columns
        this.ToggleColumns(true, 2);

        //Toogle MouseLine 
        this.ToggleColumns(true, 3);

        //Toogle Geno Type 
        this.ToggleColumns(true, 8);
    }

    public getTableContent() {
       
        this.mouseDataservice.getData().subscribe((data) => {
            this.jsonToMouse(data);

            this.notificationService.toast(
                "Fetching table data completed...",
                false
            )
            
            this.dataSource.disconnect();
            this.dataSource.data = this.datalist;
            this.dataSource.connect();
        });
    }

    Init() {
        //Getting data from database
        this.mouseDataservice.getData().subscribe((data) => {
            this.jsonToMouse(data);
            this.dataSource = new MatTableDataSource(this.datalist);

            this.notificationService.toast(
                "Fetching table data completed...",
                false
            )

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            //Set the custom sorting data method
            this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
                if (sortHeaderId === 'pfa') {
                    let flags = data.pfa.liver ||
                        data.pfa.liver_tumor ||
                        data.pfa.small_intenstine ||
                        data.pfa.small_intenstine_tumor ||
                        data.pfa.skin ||
                        data.pfa.skin_hair ||
                        (data.pfa.other !== '')
                    return flags;
                }
                if (sortHeaderId === 'freezedown') {

                    let flags = data.freezedown.liver ||
                        data.freezedown.liver_tumor ||
                        (data.freezedown.other !== '');
                    return flags;
                }

                return data[sortHeaderId];
            };
        });
    }

    constructor(
        private mouseDataservice: mouseservice,
        private snackBar: MatSnackBar,
        private notificationService:NotificationService,
        private fileuploader: FileUploader,
        public dialog: MatDialog) {
        this.Math = Math;
        this.ONEDAY = ONEDAY;
    }


    //convert json data array from server to mouse models in angular 2 web app
    jsonToMouse(data) {
        this.datalist = data.map((data) => {
            let data_field = data.fields;
            let pfa: PFA = new PFA(
                data_field.pfa_liver,
                data_field.pfa_liver_tumor ,
                data_field.pfa_small_intenstine,
                data_field.pfa_small_intenstine_tumor,
                data_field.pfa_skin ,
                data_field.pfa_skin_hair,
                data_field.pfa_other
            );
            let freezedown: FreezeDown = new FreezeDown(
                data_field.freezedown_liver,
                data_field.freezedown_liver_tumor,
                data_field.freezedown_other
            );

            
            let age = Math.round(Math.abs((new Date(data_field.deathdate).getTime() - new Date(data_field.birthdate).getTime()) / (ONEDAY)));

            if(new Date(data_field.birthdate).toLocaleDateString("en-sg")=='01/01/1980'){
                age = -1;
            }

            data = new Mouse(
                data.pk,
                data_field.gender,
                data_field.mouseline,
                new Date(data_field.birthdate),
                new Date(data_field.deathdate),
                data_field.genotype,
                age,
                data_field.genotype_confirmation,
                data_field.phenotype,
                data_field.project_title,
                data_field.sacrificer,
                data_field.purpose,
                data_field.comment,
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

    import_csv(){
        this.csvfileInput.nativeElement.click();
    }

    onFileChange(event){
        console.log(event);

        this.fileuploader.addFiles(event.target.files);
        this.importcsvevent.emit();
    }

    export_csv() {
        //convert mouse array data into json data
        let jsonData = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort).map((data: Mouse) => {


            let age = Math.round(Math.abs((new Date(data.deathdate).getTime() - new Date(data.birthdate).getTime()) / (ONEDAY)));

            let jsonObject = {
                genotype_confirmation: data.genotype_confirmation,
                physical_id: data.physical_id,
                mouseline: data.mouseline,
                birthdate: data.birthdate.toLocaleDateString("en-sg"),
                deathdate: data.deathdate.toLocaleDateString("en-sg"),
                age: age,
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
                let id = data.id;
                if (!data.checked) {
                    if (id == 'pfa') {
                        //remove property from json object
                        let pfacol_arr = [
                            'pfa_liver',
                            'pfa_liver_tumor',
                            'pfa_small_intenstine',
                            'pfa_small_intenstine_tumor',
                            'pfa_skin',
                            'pfa_skin_hair',
                            'pfa_other'
                        ]
                        jsonObject = this.removejsonPropery(jsonObject, pfacol_arr);
                        //Remove header name from csv_display_title
                    } else if (id == 'freezedown') {
                        let pfacol_arr = [
                            'freezedown_liver',
                            'freezedown_liver_tumor',
                            'freezedown_other'
                        ]
                        jsonObject = this.removejsonPropery(jsonObject, pfacol_arr);
                    } else {
                        if (data.pos != -1) {
                            //Remove property from the json object
                            let pfacol_arr = [];
                            pfacol_arr.push(id);
                            jsonObject = this.removejsonPropery(jsonObject, pfacol_arr);
                        }
                    }
                }
            })
            return jsonObject;
        });

        let csv_display_title = [
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
            'PFA Liver',
            'PFA Liver With Tumor',
            'PFA Small Internstine',
            'PFA Small Internstine WIth Tumor',
            'PFA Skin',
            'PFA Skin With Hair',
            'PFA Other',
            'FreezeDown Liver',
            'FreezeDown Liver With Tumor',
            'FreezeDown Other'
        ];

        //Processing col headers
        this.originalColumns.map(data => {

            let id = data.id;

            if (!data.checked) {
                switch (id) {
                    case 'pfa':
                        //remove 7 elements starting from pos 12
                        let arr_display_pfa = [
                            'PFA Liver',
                            'PFA Liver With Tumor',
                            'PFA Small Internstine',
                            'PFA Small Internstine WIth Tumor',
                            'PFA Skin',
                            'PFA Skin With Hair',
                            'PFA Other'
                        ]
                        for (let d of arr_display_pfa) {
                            let index = csv_display_title.indexOf(d);
                            csv_display_title.splice(index, 1);
                        }
                        break;
                    case 'freezedown':
                        //remove 3 elements starting from pos 19
                        let arr_display_freezedown = [
                            'FreezeDown Liver',
                            'FreezeDown Liver With Tumor',
                            'FreezeDown Other'
                        ]
                        for (let d of arr_display_freezedown) {
                            let index = csv_display_title.indexOf(d);
                            csv_display_title.splice(index, 1);
                        }
                        break;
                    default:
                        if (data.pos != -1) {
                            let index = csv_display_title.indexOf(data.display);
                            csv_display_title.splice(index, 1);
                            break;
                        }
                }
            }
        });


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

    removejsonPropery(targetJson, col_id_arr: string[]): any {
        col_id_arr.map((col_id) => {
            delete targetJson[col_id];
        });

        return targetJson;
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
    showDelay = new FormControl(500);
    selectRow(row) {
        this.openDialog(row);
    }

    @Output('importtableImageevent') importtableImageevent = new EventEmitter<any>();

    private dialogRef = null;

    openDialog(row): void {
        this.dialogRef = this.dialog.open(DialogView, {
            width: '1200px',
            data: { row: row },
            panelClass: 'my-panel'
        });
        
        this.dialogRef.componentInstance.importImageevent.subscribe(
            event => {
                this.importtableImageevent.emit(event);
            }
        )
        

        this.dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.dialogRef = null;
        });
    }
    detail(mouse){
        this.dialog.open(
            viewDialog,
            {   
                width: '550px',
                data: { mouse:  mouse },
                panelClass: 'my-panel'
            }
        )
    }
}

@Component({
  selector: 'viewdialog',
  template: `
    <div class="round-corner">
        <mat-list>
        <h3 mat-subheader>PFA</h3>
            <mat-list-item>
                <div class="row" style="width: 100%;">
                    <div class="col-6"  >
                        <span *ngIf="data.mouse.pfa.liver">Liver: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.liver">Liver: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                    <div class="col-6" >
                        <span *ngIf="data.mouse.pfa.liver_tumor" >Liver Tumor: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.liver_tumor">Liver Tumor: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                </div>
            </mat-list-item>
            <mat-list-item>
                <div class="row" style="width: 100%;">
                    <div class="col-6"  >
                        <span *ngIf="data.mouse.pfa.small_intenstine">Small Intenstine: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.small_intenstine">Small Intenstine: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                    <div class="col-6" >
                        <span *ngIf="data.mouse.pfa.small_intenstine_tumor" >Small Intenstine Tumor: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.small_intenstine_tumor">Small Intenstine Tumor: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                </div>
            </mat-list-item>
            <mat-list-item>
                <div class="row" style="width: 100%;">
                    <div class="col-6"  >
                        <span *ngIf="data.mouse.pfa.skin">Skin: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.skin">Skin: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                    <div class="col-6" >
                        <span *ngIf="data.mouse.pfa.skin_hair" >Skin Hair: 
                            <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                        </span>
                        <span *ngIf="!data.mouse.pfa.skin_hair">Skin Hair: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                </div>
            </mat-list-item>
            <mat-list-item>
                <div class="row" style="width: 100%;">
                    <div class="col-6">
                        <span *ngIf="data.mouse.pfa.other != ''">Other: 
                            {{data.mouse.pfa.other}}
                        </span>
                        <span *ngIf="data.mouse.pfa.other == ''">Other: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                </div>
            </mat-list-item>
            <mat-divider></mat-divider>
            <h3 mat-subheader>FreezeDown</h3>
            <mat-list-item>
            <div class="row" style="width: 100%;">
                <div class="col-6"  >
                    <span *ngIf="data.mouse.freezedown.liver">Liver: 
                        <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                    </span>
                    <span *ngIf="!data.mouse.freezedown.liver">Liver: 
                        <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                    </span>
                </div>
                <div class="col-6" >
                    <span *ngIf="data.mouse.freezedown.liver_tumor" >Liver Tumor: 
                        <i class="fa fa-check" aria-hidden="true" style="color: green;"></i>
                    </span>
                    <span *ngIf="!data.mouse.freezedown.liver_tumor">Liver Tumor: 
                        <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                    </span>
                </div>
            </div>
            </mat-list-item>
            <mat-list-item>
                <div class="row" style="width: 100%;">
                    <div class="col-6">
                        <span *ngIf="data.mouse.freezedown.other != ''">Other: 
                            {{data.mouse.freezedown.other}}
                        </span>
                        <span *ngIf="data.mouse.freezedown.other == ''">Other: 
                            <i class="fa fa-times" aria-hidden="true" style="color: red;"></i>
                        </span>
                    </div>
                </div>
            </mat-list-item>
        </mat-list>
        

    </div>
  `,
  styles: [
      `
      .round-corner{
         border-radius: 10px;
        
      `
  ]
})
export class viewDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}