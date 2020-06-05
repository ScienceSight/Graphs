import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import * as FunctionCurveEditor from "../function-curve-editor";
import {CreateGraphModel} from "./_models/_graph/create-graph-model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   title = 'Graphs';

   ngOnInit(): void {
   }
}
