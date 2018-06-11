import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASEURL, INSERTMOUSE, MOUSETABLE } from '../../constants/constants';

@Injectable()
export class mouseservice {


    constructor(private http: HttpClient) {

    }

    getData(): Observable<any> {
        let requesturl: string = BASEURL + MOUSETABLE;

        //Solve CSS problem
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Headers': 'http://127.0.0.1:8000/',
                'Content-Type': 'application/json;charset=utf-8'
            })
        };

        return this.http.get(requesturl, httpOptions);
    }

    insertData(mouse): Observable<any> {
        let requesturl: string = BASEURL + INSERTMOUSE;

        //Solve CSS problem
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Headers': 'http://127.0.0.1:8000/',
                'Content-Type': 'application/json;charset=utf-8'
            })
        };

        return this.http.post(requesturl, mouse, httpOptions);
    }
}
