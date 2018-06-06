import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

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
  MatIconModule
} 
from '@angular/material';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//User defined view
import { tableview } from './components/tableview/tableview.component';
import { InsertMouseView, BottomMenu } from './components/insertmouseview/insertmouseview.component';
import { DialogView } from './components/tableview/dialogview/dialogview.component';
import { AppComponent } from './app.component';
import { EditMouseView } from './components/editmouseview/editmouseview.component';
import { EditMouseViewSmall } from './components/editmouseview/editmousesmallview/editmousesmallview.component';
//Services module
import { mouseservice } from '../app/services/dataservice/mouseservice.service';
import { DynamicLoader } from '../app/services/dynamicloader/dynamicloader.service';

//3rd Party image uploader module
import { ImageUploadModule } from "angular2-image-upload";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';



@NgModule({
  declarations: [
    AppComponent,
    tableview,
    InsertMouseView,
    BottomMenu,
    DialogView,
    EditMouseView,
    EditMouseViewSmall
  ],
  entryComponents: [
    BottomMenu,
    DialogView,
    EditMouseViewSmall,
    EditMouseView
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
    LazyLoadImagesModule
  ],
  providers: [
    mouseservice,
    DynamicLoader
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
