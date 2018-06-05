import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
    selector: 'dialogview',
    templateUrl: './dialogview.component.html',
    styleUrls: ['./dialogview.component.css']
  })
  export class DialogView {
  
    constructor(
      public dialogRef: MatDialogRef<DialogView>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    onExitClick(): void {
      this.dialogRef.close();
    }
  
  }