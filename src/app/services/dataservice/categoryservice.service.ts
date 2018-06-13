import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASEURL, GETCAT, INSERTCAT } from '../../constants/constants';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Headers': BASEURL,
        'Content-Type': 'application/json;charset=utf-8'
    })
};

@Injectable()
export class categoryservice {


    constructor(private httpclient: HttpClient) { }

    getData(): Observable<any> {

        let requesturl: string = BASEURL + GETCAT;
        return this.httpclient.get(requesturl);
    }

    insertData(typename: string, value: string): Observable<any> {

        let requesturl: string = BASEURL + INSERTCAT;

        //Data must Stringify
        let data = {
            type: typename,
            input: value
        }

        let jsondata = JSON.stringify(data);

        return this.httpclient.post(requesturl, data, httpOptions);
    }
}
