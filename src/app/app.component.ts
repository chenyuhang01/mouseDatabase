import { Component, ViewChild } from '@angular/core';

import { Mouse } from '../app/components/model/mouse.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  insertmousechecked_flag = false;
  uploadfileviewchecked_flag = false;
  editmousechecked_flag = true;
  mouselist: Mouse[];

  @ViewChild('tableview') tableview;
  @ViewChild('uploadfileview') uploadfileview;
  @ViewChild('insertmouseviewref') insertmouseviewref;
  constructor() { }

  insertmouseview() {
    this.insertmousechecked_flag = !this.insertmousechecked_flag;
  }

  closepanel() {
    this.insertmouseview();
    this.tableview.closepanel();
  }

  confirmButtonEvent(mouselistparam) {
    this.mouselist = mouselistparam;
  }

  cancelButtonEventHandler(mouselist) {
    if (mouselist.length == 0) {
      this.tableview.closeEditEnabled();
    }
  }

  insertSuccessEventHandler() {
    this.tableview.getTableContent();
  }

  startUploading() {
    this.uploadfileview.startupload();
    this.uploadfileviewchecked_flag = true;
  }

  uploadFinishedEventHandler() {
    this.tableview.getTableContent();

    this.insertmouseviewref.getCategoryData(false);
  }



  notaskseventHandler() {
    this.uploadfileviewchecked_flag = !this.uploadfileviewchecked_flag;
  }

  updatefinishedEventHandler(){
    console.log("Update Finished");
    this.tableview.getTableContent();
  }

  importtableImageeventHandler(physical_id){
    this.uploadfileview.startuploadImage(physical_id);

    this.uploadfileviewchecked_flag = true;
  }

  importImageeventHandler(physical_id){
    this.uploadfileview.startuploadImage(physical_id);
    this.uploadfileviewchecked_flag = true;
  }

  uploadImageFinishedEventHandler(){
    if(this.tableview.dialogRef != null){
      this.tableview.dialogRef.componentInstance.getImage();
    }
  }

}

