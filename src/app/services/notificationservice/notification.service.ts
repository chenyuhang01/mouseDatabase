import { Injectable, Component, Inject, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';

import {
    MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef
} from '@angular/material';


interface Message {
    message: any,
    iserror: boolean
}

@Injectable()
export class NotificationService {

    private messageLists: Message[] = [];

    private timer_local;
    private stopped: boolean = false;

    private suscription;

    constructor(
        private snackBar: MatSnackBar
    ) {
        this.timer_local = timer(0, 2000);
        this.suscription = this.timer_local.subscribe(
            (tick) => {
                this.open();
            });
    }
    
    toast(message: any, iserror: boolean): void {
        let message_temp: Message = {
            message: message,
            iserror: iserror
        }
         
        this.messageLists.push(message_temp);
        if (this.messageLists.length == 1 && this.stopped) {
            this.suscription = this.timer_local.subscribe(
                (tick) => {
                    this.open();
                });
            this.stopped = false;
        }

        console.log('In toast: ' + this.messageLists.length);
    }


    //Used to open the snackbar
    open(): void {

        if (this.messageLists.length == 0) {
            this.suscription.unsubscribe();
            this.stopped = true;
            console.log('In open(0): ' + this.messageLists.length);
        }
        else if (this.messageLists.length == 1) {
            let messagetemp = this.messageLists.shift();
            console.log('In open(1): ' + this.messageLists.length);
            console.log(messagetemp.message);
            let ref:MatSnackBarRef<SnackBarComponent> = this.snackBar.openFromComponent(
                SnackBarComponent,
                {
                    data: messagetemp,
                    duration: 2000
                }
            )
            ref.instance.dismissEvent.subscribe(
                event => {
                    this.snackBar.dismiss();
                }
            )
        } else {
            let messagetemp = this.messageLists.shift();
            console.log('In open(>1): ' + this.messageLists.length);
            console.log(messagetemp.message);
            let ref:MatSnackBarRef<SnackBarComponent> = this.snackBar.openFromComponent(
                SnackBarComponent,
                {
                    data: messagetemp
                }
            )

            ref.instance.dismissEvent.subscribe(
                event => {
                    this.snackBar.dismiss();
                }
            )
        }
    }
}



/* ErrorMessage Component */
@Component({
    template: `
        <div *ngIf="data.iserror">
            <p>Error Code: {{data.message.error_code}}</p>
            <p>Error Message: <p *ngFor='let error_m of data.message.error_message' >{{error_m}}</p>
        </div>
        <div *ngIf="!data.iserror">
            {{data.message}}
            <div class="mat-simple-snackbar-action" style="display: inline-block;">
                <button mat-button (click)="action()">Dismiss</button>
            </div>
        </div>
    `
})
export class SnackBarComponent {

    @Output ('dismissEvent') dismissEvent = new EventEmitter<any>();

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

    action(){
       this.dismissEvent.emit();
    }
}