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
    private listOfObservable: Observable<any>[] = [];

    constructor(private http: HttpClient) { }

    addFiles(file) {
        for (let fileinput of file) {
            this.fileToBeUploaded.push(fileinput);
        }

        console.log("File Added");
    }

    uploadFiles() {

        const fileuploadrequesturl = BASEURL + UPLOADFILE;
        let filenameLists: string[] = []
        console.log("Start Uploading file");

        if (this.fileToBeUploaded.length > 0) {


            for (let file of this.fileToBeUploaded) {
                let formdata = new FormData();
                formdata.append('file', file);
                formdata.append('filename', file.name);

                this.listOfObservable.push(this.http.post(
                    fileuploadrequesturl,
                    formdata,
                    httpOptions
                ));
                console.log('Uploading Now: ' + file.name);
                var index = this.fileToBeUploaded.indexOf(file);
                if (index > -1) {
                    this.fileToBeUploaded.splice(index, 1);
                }
            }


            return this.listOfObservable;
        }


    }
}