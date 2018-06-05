import { Component, ViewContainerRef, ViewChild, Renderer2} from '@angular/core';
import { DynamicLoader } from './services/dynamicloader/dynamicloader.service';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { Mouse } from '../app/components/model/mouse.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  insertmousechecked_flag = false;
  editmousechecked_flag = true;
  mouselist: Mouse[];

  @ViewChild('tableview') tableview;
  constructor(public renderer2: Renderer2) {
    
  }


  ngOnInit() {
   
  }

  insertmouseview() {
    this.insertmousechecked_flag = !this.insertmousechecked_flag ;
  }

  closepanel(){
    this.insertmouseview();
    this.tableview.closepanel();
  }
  
  confirmButtonEvent(mouselistparam){

    this.mouselist = mouselistparam;
  }
  
  cancelButtonEventHandler(mouselist){
    if(mouselist.length == 0){
      this.tableview.closeEditEnabled();
    }
    
  }

}

