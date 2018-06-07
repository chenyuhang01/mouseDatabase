import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '@angular/http';

import { BASEURL } from '../../constants/constants';

@Injectable()
export class categoryservice{


    constructor(private http:Http){

    }

    getData() : Observable<any>{

        let requesturl:string = './assets/category.json';

        return this.http.get(requesturl);
    }
}
