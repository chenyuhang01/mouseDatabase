import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { UPLOADFILE, BASEURL } from '../../constants/constants';
import { Observable } from 'rxjs';


//Solve CSS problem
const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Headers': BASEURL
    })
};

@Injectable()
export class FileUploader {

    private fileToBeUploaded: File[] = [];
    private listOfObservable: any[] = [];

    private counter:number = 0;
    constructor(private http: HttpClient) { }

    addFiles(file) {
        for (let fileinput of file) {
            this.fileToBeUploaded.push(fileinput);
        }

        console.log("File Added");
    }

    getFiles(){
        return this.fileToBeUploaded;
    }

    uploadFiles() {

        const fileuploadrequesturl = BASEURL + UPLOADFILE;

        console.log("Start Uploading file");

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