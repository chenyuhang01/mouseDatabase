import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Material Modules
import { 
  MatTableModule, 
  MatPaginatorModule,
  MatSortModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatExpansionModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBottomSheetModule,
  MatListModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatCardModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MAT_DATE_LOCALE,MAT_SNACK_BAR_DATA
} 
from '@angular/material';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//User defined view
import { tableview, viewDialog } from './components/tableview/tableview.component';
import { InsertMouseView, BottomMenu } from './components/insertmouseview/insertmouseview.component';
import { DialogView } from './components/tableview/dialogview/dialogview.component';
import { AppComponent } from './app.component';
import { EditMouseView } from './components/editmouseview/editmouseview.component';
import { EditMouseViewSmall } from './components/editmouseview/editmousesmallview/editmousesmallview.component';
import { SnackBarComponent, NotificationService } from './services/notificationservice/notification.service';
import { Uploadfileview } from './components/uploadfileview/uploadfileview.component';

//Services module
import { mouseservice } from '../app/services/dataservice/mouseservice.service';
import { categoryservice } from '../app/services/dataservice/categoryservice.service';
import { DynamicLoader } from '../app/services/dynamicloader/dynamicloader.service';
import { FileUploader } from '../app/services/dataservice/fileuploader.service';

//3rd Party image uploader module
import { ImageUploadModule } from "angular2-image-upload";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { PopoverModule } from '../../node_modules/ngx-popover';

@NgModule({
  declarations: [
    AppComponent,
    tableview,
    InsertMouseView,
    BottomMenu,
    DialogView,
    EditMouseView,
    EditMouseViewSmall,
    SnackBarComponent,
    Uploadfileview,
    viewDialog
  ],
  entryComponents: [
    BottomMenu,
    DialogView,
    EditMouseViewSmall,
    EditMouseView,
    SnackBarComponent,
    viewDialog
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    HttpModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCardModule,
    ImageUploadModule.forRoot(),
    MatIconModule,
    LazyLoadImageModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatProgressBarModule,
    PopoverModule
  ],
  providers: [
    mouseservice,
    categoryservice,
    DynamicLoader,
    NotificationService,
    FileUploader,
    {provide: MAT_DATE_LOCALE, useValue: 'en-sg'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(){
    
  }
}
