import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms'
import { GraphFormService } from '../_services/_graph/graph-form.service'
import { Subscription } from 'rxjs'
import * as FunctionCurveEditor from "../../function-curve-editor";
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsState } from '../_models/_graph/buttons-state';
import { Subgraph, Graph } from '../_models/_graph';
import { InterpolationType } from '../_models/_graph/interpolation-type';
import { WidgetState } from '../_models/_widget/widget-state';
import { Point, AxisPoint } from '../_models/_graph/point';
import { CsvFileService } from '../_services/_file/csv-file.service';
import { GraphToCsvModel } from '../_models/_graph/graph-to-csv-model';
import { GraphMathService } from '../_services/_graph/graph-math.service';


@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  graphForm: FormGroup;
  graphFormSub: Subscription;
  formInvalid: boolean = false;
  subgraphs: FormArray;

  widget: FunctionCurveEditor.Widget;

  fileToUpload: File = null;

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  currentActivePanelId: number = undefined;
  previousActivePanelId: number = undefined;

  pointButtonsState: ButtonsState = {
    origin: false,
    xAxis: false,
    yAxis: false
  };

  constructor(private graphFormService: GraphFormService,
              private graphMathService: GraphMathService,
              private csvFileService: CsvFileService) { }

  ngOnInit() {
    this.graphFormSub = this.graphFormService.graphForm$
      .subscribe(graph => {
          this.graphForm = graph
          this.subgraphs = this.graphForm.get('subgraphs') as FormArray
        });
       
       const initialEditorState = <FunctionCurveEditor.EditorState>{
          knots:          [],
          xMin:           0,
          xMax:           1000,
          yMin:           0,
          yMax:           700,
          extendedDomain: false,
          gridEnabled:    false,
          interpolationMethod: "bSpline"
       };

       this.graphFormService.addSubgraph()
   
       this.startup(initialEditorState);
  }

  ngOnDestroy() {
    this.graphFormSub.unsubscribe()
  }

  addSubgraph() {
    this.graphFormService.addSubgraph()
  }

  deleteSubgraph(index: number) {
    this.graphFormService.deleteSubgraph(index)
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    if (files && this.fileToUpload) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(this.fileToUpload);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    const base64textString = btoa(binaryString);
    this.widget.setWidgetContextImage(base64textString, this.fileToUpload.type);
   }

  saveGraph() {
    console.log(this.graphForm.value)

    const graphToCsvModel = Array<GraphToCsvModel>();

    const graphData = this.graphForm.value as Graph;
    const calculatedGraph = this.graphMathService.calculateResultGraph(graphData);
    
    console.log(calculatedGraph)

    for (let i = 0; i < calculatedGraph.subgraphs.length; i++) {
      const csvModel = new GraphToCsvModel();

      csvModel.originPoint = calculatedGraph.originPoint;
      csvModel.subgraphCoordinates = calculatedGraph.subgraphs[i].coordinates;
      csvModel.subgraphId = calculatedGraph.subgraphs[i].id;
      csvModel.subgraphInterpolationType = calculatedGraph.subgraphs[i].interpolationType;
      csvModel.subgraphKnots = calculatedGraph.subgraphs[i].knots;
      csvModel.subgraphName = calculatedGraph.subgraphs[i].name;
      csvModel.xAxisName = calculatedGraph.xAxisName;
      csvModel.xAxisPoint = calculatedGraph.xAxisPoint;
      csvModel.yAxisName = calculatedGraph.yAxisName;
      csvModel.yAxisPoint = calculatedGraph.yAxisPoint;

      graphToCsvModel.push(csvModel);     
    }

    const fileName = (this.fileToUpload ? this.fileToUpload.name.split('.')[0] : 'myfile') + '.csv';

    this.csvFileService.saveCsvFromGraphData(graphToCsvModel, fileName);
  }

  tryToggleOrigin(event: MouseEvent) {
    const state = this.pointButtonsState.xAxis || this.pointButtonsState.yAxis;
    if(state)
    {
      event.stopPropagation();
      return;
    }
    if(this.pointButtonsState.origin)
    {
      this.pointButtonsState.origin = false;
      return;
    }
    this.pointButtonsState.origin = true;
    this.togglePointButton();
  }

  tryToggleX(event: MouseEvent) {
    const state = this.pointButtonsState.origin || this.pointButtonsState.yAxis;
    if(state)
    {
      event.stopPropagation();
      return;
    }
    if(this.pointButtonsState.xAxis)
    {
      this.pointButtonsState.xAxis = false;
      return;
    }
    this.pointButtonsState.xAxis = true;
    this.togglePointButton();
    //this.togglePointButton.emit(this.pointButtonsState);
  }

  tryToggleY(event: MouseEvent) {
    const state = this.pointButtonsState.origin || this.pointButtonsState.xAxis;
    if(state)
    {
      event.stopPropagation();
      return;
    }
    if(this.pointButtonsState.yAxis)
    {
      this.pointButtonsState.yAxis = false;
      return;
    }
    this.pointButtonsState.yAxis = true;
    this.togglePointButton();
    //this.togglePointButton.emit(this.pointButtonsState);
  }

  togglePointButton() {
    const eState = this.widget.getEditorState();
    eState.axisButtonsState = this.pointButtonsState;
    this.widget.setEditorState(eState);
  }

  public toggleAccordian(props: NgbPanelChangeEvent) {
    if(props.nextState == true)
    {
      this.previousActivePanelId = this.currentActivePanelId;
      this.currentActivePanelId = parseInt(props.panelId);
      this.widget.setConnected(true);
    }
    
    if(props.nextState == false)
    {
      this.previousActivePanelId = this.currentActivePanelId;
      this.currentActivePanelId = undefined;
      this.widget.setConnected(false);
    }

    this.setInitialWidgetState();
  }

  setInitialWidgetState() {
    const eState = this.widget.getEditorState();

    if(this.currentActivePanelId != undefined)
    {
      const widgetState = this.graphFormService.getSubgraphData(this.currentActivePanelId);
      eState.knots = widgetState.knots;
      eState.interpolationMethod = widgetState.interpolationType;
    }

    this.widget.setEditorState(eState);
  }

  interpolationTypeChanged(method: string) {
    const eState = this.widget.getEditorState();
    eState.interpolationMethod = <FunctionCurveEditor.InterpolationMethod>method;
    this.widget.setEditorState(eState);
  }

  public widgetChangeEventHandler() {
    const eState = this.widget.getEditorState();

    const widgetState = new WidgetState();
    widgetState.subgraphId = this.currentActivePanelId;
    widgetState.interpolationType = eState.interpolationMethod as InterpolationType;
    widgetState.knots = eState.knots;
    widgetState.coordinates = eState.coordinates;
    widgetState.originPoint = eState.originPoint as Point;
    widgetState.xAxisPoint = eState.xAxisPoint as Point;
    widgetState.yAxisPoint = eState.yAxisPoint as Point;

    this.graphFormService.setSubgraphData(widgetState);
  }

  private startup(initialEditorState: FunctionCurveEditor.EditorState) {
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("functionCurveEditor");
      this.widget = new FunctionCurveEditor.Widget(canvas, false);
      this.widget.setWidgetChangeEventHandler(()=> {this.widgetChangeEventHandler() });
      this.widget.setEditorState(initialEditorState);
  }
}