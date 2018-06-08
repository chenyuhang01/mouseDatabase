import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASEURL, GETCAT, INSERTCAT } from '../../constants/constants';

@Injectable()
export class categoryservice {


    constructor(private httpclient: HttpClient) {

    }

    getData(): Observable<any> {

        let requesturl: string = BASEURL + GETCAT;

        //Solve CSS problem
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Headers': 'http://127.0.0.1:8000/',
                'Content-Type': 'application/json;charset=utf-8'
            })
        };

        return this.httpclient.get(requesturl);
    }

    insertData(typename: string, value: string): Observable<any> {

        let requesturl: string = BASEURL + INSERTCAT;

        //Solve CSS problem
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Headers': 'http://127.0.0.1:8000/',
                'Content-Type': 'application/json;charset=utf-8'
            })
        };

        //Data must Stringify
        let data = {
            type: typename,
            input: value
        }

        let jsondata = JSON.stringify(data);

        return this.httpclient.post(requesturl, data, httpOptions);
    }
}
