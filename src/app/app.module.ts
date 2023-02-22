import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component'
import { SubgraphComponent } from './graph/subgraph/subgraph.component'
import { GraphFormService } from './_services/_graph/graph-form.service'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphMathService } from './_services/_graph/graph-math.service';
import { AppRoutingModule } from './app-routing.module';
import { JsonFileService } from './_services/_file/json-file.service';
import { HttpService } from './_services/_http/http.service';
import { XAxisPointComponent } from './graph/x-axis-point/x-axis-point.component';
import { YAxisPointComponent } from './graph/y-axis-point/y-axis-point.component';
import { ConfigurationService } from './_services/_config/configuration.service';

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
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [ConfigurationService],
      useFactory : (config : ConfigurationService) => () => config.loadAppConfig()
    },
    GraphFormService,
    GraphMathService,
    JsonFileService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
