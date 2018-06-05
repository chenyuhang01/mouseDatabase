import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '@angular/http';

import { BASEURL } from '../../constants/constants';

@Injectable()
export class mouseservice{


    constructor(private http:Http){

    }

    getData() : Observable<any>{

        let requesturl:string = './assets/mouse_db.json';

        return this.http.get(requesturl);
    }
}
