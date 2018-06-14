import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { UPLOADFILE, BASEURL, IMAGEUPLOAD } from '../../constants/constants';
import { Observable } from 'rxjs';


//Solve CSS problem
const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Headers': BASEURL
    })
};

@Injectable()
export class FileUploader {

    public fileToBeUploaded: File[] = [];
    public listOfObservable: any[] = [];

    public counter:number = 0;

    constructor(public http: HttpClient) { }

    addFiles(file) {
        for (let fileinput of file) {
            this.fileToBeUploaded.push(fileinput);
        }
    }


    getFiles(){
        return this.fileToBeUploaded;
    }

    uploadImageFiles(physical_id: string){
        const fileuploadrequesturl = BASEURL + IMAGEUPLOAD;

        console.log("Start Uploading file");
        this.listOfObservable = [];
        if (this.fileToBeUploaded.length > 0) {
            for (let file of this.fileToBeUploaded) {
                let formdata = new FormData();
                formdata.append('fileid', this.counter.toString());
                formdata.append('file', file);
                formdata.append('filename', file.name);
                formdata.append('physical_id', physical_id)
                
                this.listOfObservable.push(
                    
                    {
                        observable: this.http.post(fileuploadrequesturl,formdata,httpOptions),
                        fileid: this.counter
                    }
                );

                this.counter = this.counter + 1;
                console.log('Uploading Now: ' + file.name);
                var index = this.fileToBeUploaded.indexOf(file);
            }
            this.fileToBeUploaded = [];
            return this.listOfObservable;
        }       
    }

    uploadFiles() {

        const fileuploadrequesturl = BASEURL + UPLOADFILE;

        console.log("Start Uploading file");
        this.listOfObservable = [];
        if (this.fileToBeUploaded.length > 0) {
            for (let file of this.fileToBeUploaded) {
                let formdata = new FormData();
                formdata.append('fileid', this.counter.toString());
                formdata.append('file', file);
                formdata.append('filename', file.name);
                
                this.listOfObservable.push(
                    
                    {
                        observable: this.http.post(fileuploadrequesturl,formdata,httpOptions),
                        fileid: this.counter
                    }
                );

                this.counter = this.counter + 1;
                console.log('Uploading Now: ' + file.name);
                var index = this.fileToBeUploaded.indexOf(file);
            }
            this.fileToBeUploaded = [];

            return this.listOfObservable;
        }
    }
}