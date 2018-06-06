import { Component, ViewContainerRef, ViewChild, OnInit, Input, NgZone, EventEmitter,Output} from '@angular/core';
import { EditMouseViewSmall } from './editmousesmallview/editmousesmallview.component';
import { Mouse } from '../model/mouse.component';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'editmouseview',
    templateUrl: './editmouseview.component.html',
    styleUrls: ['./editmouseview.component.css']
})
export class EditMouseView implements OnInit{

    @Input() mouselist;
    @Input() groupEditFlag: boolean;
    @Output('cancelButtonEvent') cancelButtonEvent = new EventEmitter<any>();

    @Input() GroupEditFlag: boolean;

    constructor(public zone: NgZone){
        
    }

    ngOnInit(){
        
    }

    canceleventHandler(index){
        this.mouselist.splice(index, 1);
        this.cancelButtonEvent.emit(this.mouselist);
    }



    
}