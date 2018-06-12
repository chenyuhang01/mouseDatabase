import { Component, Output,EventEmitter  } from '@angular/core';
import { FileUploader } from '../../services/dataservice/fileuploader.service';
import { NotificationService } from '../../services/notificationservice/notification.service';

@Component({
    selector: "uploadfileview",
    templateUrl: "./uploadfileview.component.html",
    styleUrls: ["./uploadfileview.component.css"]
})
export class Uploadfileview {

    @Output('uploadFinishedEvent') uploadFinishedEvent = new EventEmitter<any>();

    constructor(
        private fileuploader: FileUploader,
        private notificationservice: NotificationService
    ) { }

    

    public startupload() {
        this.fileuploader.uploadFiles().map(
            event => {
                event.subscribe(
                    complete => {
                        let error_message_lists: string[] = complete.result.split(".");
                        let errordata = {
                            error_code: complete.errorCode,
                            error_message: error_message_lists
                        }
                        if (complete.error) {
                            this.notificationservice.toast(
                                errordata,
                                complete.error
                            );
                        } else {
                            this.notificationservice.toast(
                                complete.result,
                                false
                            );
                        }
                        this.uploadFinishedEvent.emit();
                    }
                )
            }
        );
    }
}