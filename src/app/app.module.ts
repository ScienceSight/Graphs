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
import { GraphReviewComponent } from './graph-review/graph-review.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    SubgraphComponent,
    GraphComponent,
    GraphReviewComponent
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
    CsvFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
