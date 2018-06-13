import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { mouseservice } from '../../../services/dataservice/mouseservice.service';
import {  NotificationService } from '../../../services/notificationservice/notification.service';
import baguetteBox from 'baguettebox.js';

import { SERVER,IMAGEURL } from '../../../constants/constants';

import { timer } from 'rxjs';

@Component({
  selector: 'dialogview',
  templateUrl: './dialogview.component.html',
  styleUrls: ['./dialogview.component.css']
})
export class DialogView implements OnInit {

  private imageLists: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogView>,
    private mouseservicehandler: mouseservice,
    private notificationService:NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.mouseservicehandler.getMouseImage(this.data.row.physical_id).subscribe(
        event => {
          let error: boolean = event.error;
          let errorCode: string = event.errorCode;
          let result: string = event.result;
  
          if (error) {
  
            let error_message_lists: string[] = result.split(".");
  
            let errordata = {
              error_code: errorCode,
              error_message: error_message_lists
            }
            this.notificationService.toast(
              errordata,
              true
            )
          } else {
            this.notificationService.toast(
              'Image feteched Success',
              false
            )
            let images: string[] = result.split(",");
            images.splice(-1,1);
            for (let image of images){
              let imageurl = SERVER + IMAGEURL + this.data.row.physical_id + '/' + image;
              this.imageLists.push(imageurl);
            }
            let timer_local = timer(1000);
            let  suscription = timer_local.subscribe(
                (tick) => {
                  baguetteBox.run('.grid-gallery');
                });
            
          }
        }
      )
  }

  ngOnInit() {
    ;
  }

  onExitClick(): void {
    this.dialogRef.close();
  }

}