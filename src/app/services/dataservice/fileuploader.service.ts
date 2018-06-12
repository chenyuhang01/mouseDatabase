import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UPLOADFILE, BASEURL } from '../../constants/constants';

@Injectable()
export class FileUploader {

    private fileToBeUploaded: File[] = [];

    constructor(private http: HttpClient) { }

    addFiles(file: File) {
        this.fileToBeUploaded.push(file);
        console.log("File Added");
    }

    uploadFiles() {

        const fileuploadrequesturl = BASEURL + UPLOADFILE;

        console.log("Start Uploading file");

        if (this.fileToBeUploaded.length > 0) {
            let formdata = new FormData();

            for (let file of this.fileToBeUploaded) {
                formdata.append('uploadFile', new Blob([file]), file.name);
            }
            //Solve CSS problem
            const httpOptions = {
                headers: new HttpHeaders({
                    'Access-Control-Allow-Headers': 'http://127.0.0.1:8000/',
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                })
            };
            return this.http.post(
                fileuploadrequesturl,
                formdata,
                httpOptions
            )
        }

    }
}