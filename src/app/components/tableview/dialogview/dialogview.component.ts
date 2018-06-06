import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import baguetteBox from 'baguettebox.js';

@Component({
  selector: 'dialogview',
  templateUrl: './dialogview.component.html',
  styleUrls: ['./dialogview.component.css']
})
export class DialogView implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogView>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    baguetteBox.run('.grid-gallery');
  }

  onExitClick(): void {
    this.dialogRef.close();
  }

}