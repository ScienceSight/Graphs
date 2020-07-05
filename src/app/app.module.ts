import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component'
import { SubgraphComponent } from './graph/subgraph/subgraph.component'
import { GraphFormService } from './_services/_graph/graph-form.service'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CsvFileService } from './_services/_file/csv-file.service';
import { GraphMathService } from './_services/_graph/graph-math.service';
import { AppRoutingModule } from './app-routing.module';
import { JsonFileService } from './_services/_file/json-file.service';
import { XAxisPointComponent } from './graph/x-axis-point/x-axis-point.component';
import { YAxisPointComponent } from './graph/y-axis-point/y-axis-point.component';

@NgModule({
  declarations: [
    AppComponent,
    SubgraphComponent,
    XAxisPointComponent,
    YAxisPointComponent,
    GraphComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [
    GraphFormService,
    GraphMathService,
    CsvFileService,
    JsonFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
