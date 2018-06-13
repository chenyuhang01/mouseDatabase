import { Component, Inject, OnInit,Output,ViewChild,EventEmitter,ElementRef  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { mouseservice } from '../../../services/dataservice/mouseservice.service';
import { NotificationService } from '../../../services/notificationservice/notification.service';
import baguetteBox from 'baguettebox.js';

import { SERVER, IMAGEURL } from '../../../constants/constants';

import { timer } from 'rxjs';
import { FileUploader } from '../../../services/dataservice/fileuploader.service';

@Component({
  selector: 'dialogview',
  templateUrl: './dialogview.component.html',
  styleUrls: ['./dialogview.component.css']
})
export class DialogView implements OnInit {

  private imageLists: string[] = [];

  @Output('importImageevent') importImageevent = new EventEmitter<any>();

  @ViewChild('imagefileInput') imagefileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<DialogView>,
    private mouseservicehandler: mouseservice,
    private notificationService: NotificationService,
    private fileuploader: FileUploader,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.getImage();
  }

  getImage(){
    console.log(this.data.row.physical_id);
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

          let images: string[] = result.split(",");
          images.splice(-1, 1);
          this.imageLists = [];
          for (let image of images) {
            let imageurl = SERVER + IMAGEURL + this.data.row.physical_id + '/' + image;
            this.imageLists.push(imageurl);
          }
          let timer_local = timer(1000);
          let suscription = timer_local.subscribe(
            (tick) => {
              baguetteBox.run('.grid-gallery');
            });

        }
      }
    )
  }

  ngOnInit() {

  }

  onExitClick(): void {
    this.dialogRef.close();
  }


  onFileChange(event) {
    this.fileuploader.addFiles(event.target.files);
    console.log(event.target.files);
    this.importImageevent.emit(this.data.row.physical_id);
  }

  UploadImage() {
    this.imagefileInput.nativeElement.click();
  }

}