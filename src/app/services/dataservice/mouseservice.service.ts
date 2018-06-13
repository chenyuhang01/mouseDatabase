import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BASEURL, INSERTMOUSE, MOUSETABLE, UPDATEMOUSE, GETIMAGE } from '../../constants/constants';


//Solve CSS problem
const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Headers': BASEURL,
        'Content-Type': 'application/json;charset=utf-8'
    })
};


@Injectable()
export class mouseservice {


    constructor(private http: HttpClient) {

    }

    getData(): Observable<any> {
        let requesturl: string = BASEURL + MOUSETABLE;


        return this.http.get(requesturl, httpOptions);
    }

    updateData(mouse): Observable<any> {
        let requesturl: string = BASEURL + UPDATEMOUSE;

        return this.http.post(requesturl, mouse, httpOptions);
    }

    insertData(mouse): Observable<any> {
        let requesturl: string = BASEURL + INSERTMOUSE;

        return this.http.post(requesturl, mouse, httpOptions);
    }

    getMouseImage(physical_id: string) : Observable<any>{
        let requesturl: string = BASEURL + GETIMAGE;

        let data = {
            physical_id: physical_id
        }

        return this.http.post(requesturl, data, httpOptions);
    }
}
