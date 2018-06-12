import { Component } from '@angular/core';
import { FileUploader } from '../../services/dataservice/fileuploader.service';

@Component({
    selector: "uploadfileview",
    templateUrl: "./uploadfileview.component.html",
    styleUrls: ["./uploadfileview.component.css"] 
})
export class Uploadfileview{


    constructor( 
        private fileuploader: FileUploader
    ){ }


    public startupload(){
        this.fileuploader.uploadFiles().subscribe(
            event => {
                console.log(event);
            }
        );
    }
}