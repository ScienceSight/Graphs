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
import { GraphMathService } from '../_services/_graph/graph-math.service';
import { JsonFileService } from '../_services/_file/json-file.service';
import { JsonToGraphModel } from '../_models/_graph/json-to-graph-model';
import { GraphToJsonModel } from '../_models/_graph/graph-to-json-model';
import { Button } from 'protractor';


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
  xAxisPoints: FormArray;
  yAxisPoints: FormArray;

  widget: FunctionCurveEditor.Widget;

  imageFileToUpload: File = null;
  jsonFileToUpload: File = null;
  
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  axisButtonActive: boolean = false;

  currentActivePanelId: number = undefined;
  previousActivePanelId: number = undefined;

  pointButtonsState: ButtonsState = {
    origin: false,
    xAxis: false,
    yAxis: false
  };

  constructor(private graphFormService: GraphFormService,
              private graphMathService: GraphMathService,
              private jsonFileService: JsonFileService) { }

  ngOnInit() {
    this.graphFormSub = this.graphFormService.graphForm$
      .subscribe(graph => {
          this.graphForm = graph
          this.subgraphs = this.graphForm.get('subgraphs') as FormArray
          this.xAxisPoints = this.graphForm.get('xAxisPoints') as FormArray
          this.yAxisPoints = this.graphForm.get('yAxisPoints') as FormArray
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
       this.graphFormService.addXAxisPoint()
       this.graphFormService.addYAxisPoint()
   
       this.startup(initialEditorState);
  }

  ngOnDestroy() {
    this.graphFormSub.unsubscribe()
  }

  addSubgraph() {
    this.graphFormService.addSubgraph();

    const length = this.graphFormService.getSubgraphsLength();

    if(length == 1)
    {
      this.setInitialWidgetState();
    }
  }

  addXAxisPoint() {
    console.log(this.graphForm.value)
    this.graphFormService.addXAxisPoint();
  }

  addYAxisPoint() {
    this.graphFormService.addYAxisPoint();
  }

  deleteSubgraph(index: number) {
    this.graphFormService.deleteSubgraph(index);

    const length = this.graphFormService.getSubgraphsLength();

    if(this.currentActivePanelId <= length)
    {
      this.setInitialWidgetState();
    }
  }

  deleteXAxisPoint(index: number) {
    this.graphFormService.deleteXAxisPoint(index);

    const eState = this.widget.getEditorState();
    eState.xAxisPoints.splice(index,1);
    eState.axisPointIndex = 0;
    this.widget.setEditorState(eState); 
  }

  deleteYAxisPoint(index: number) {
    this.graphFormService.deleteYAxisPoint(index);

    const eState = this.widget.getEditorState();
    eState.yAxisPoints.splice(index,1);
    eState.axisPointIndex = 0;
    this.widget.setEditorState(eState); 
  }

  handleImageFileInput(files: FileList) {
    this.imageFileToUpload = files.item(0);

    if (files && this.imageFileToUpload) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoadedImage.bind(this);

      reader.readAsBinaryString(this.imageFileToUpload);
    }
  }

  _handleReaderLoadedImage(readerEvt) {
    var binaryString = readerEvt.target.result;
    const base64textString = btoa(binaryString);
    this.widget.setConnected(true);
    this.widget.setWidgetContextImage(base64textString, this.imageFileToUpload.type);
  }

  handleJsonFileInput(files: FileList) {
    this.jsonFileToUpload = files.item(0);

    if (files && this.jsonFileToUpload) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoadedJson.bind(this);

      reader.readAsText(this.jsonFileToUpload);
    }
  }

  _handleReaderLoadedJson(readerEvt) {
    const jsonData = readerEvt.target.result;
    let jsonToGraphModel = new Array<JsonToGraphModel>();

    try {
      jsonToGraphModel = this.jsonFileService.loadGraphDataFromJsonString(jsonData);
      console.log(jsonToGraphModel);
    } catch (error) {
      this.error = error;
      throw error;
    }

    const calculatedGraph = this.graphMathService.calculateOriginGraph(jsonToGraphModel);
    console.log(calculatedGraph);

    this.graphFormService.setGraphData(calculatedGraph);

    const eState = this.widget.getEditorState();

    eState.originPoint = {x:calculatedGraph.originPoint.xCoordinate, y:calculatedGraph.originPoint.yCoordinate};
    //eState.xAxisPoint = {x:calculatedGraph.xAxisPoint.xCoordinate, y:calculatedGraph.xAxisPoint.yCoordinate};
    //eState.yAxisPoint = {x:calculatedGraph.yAxisPoint.xCoordinate, y:calculatedGraph.yAxisPoint.yCoordinate};

    if(this.currentActivePanelId == undefined
      || this.currentActivePanelId >= calculatedGraph.subgraphs.length)
    {
      eState.knots = [];
      this.widget.setConnected(false);
    }
    else
    {
      eState.knots = calculatedGraph.subgraphs[this.currentActivePanelId].knots;
      eState.interpolationMethod = calculatedGraph.subgraphs[this.currentActivePanelId].interpolationType;
    }

    this.widget.setEditorState(eState);  
  }

  saveGraph() {
    console.log(this.graphForm.value)

    const graphToJsonModel = Array<GraphToJsonModel>();

    const graphData = this.graphForm.value as Graph;
    const calculatedGraph = this.graphMathService.calculateResultGraph(graphData);
    
    console.log(calculatedGraph)

    for (let i = 0; i < calculatedGraph.subgraphs.length; i++) {
      const jsonModel = new GraphToJsonModel();

      jsonModel.originPoint = calculatedGraph.originPoint;
      jsonModel.subgraphCoordinates = calculatedGraph.subgraphs[i].coordinates;
      jsonModel.subgraphId = calculatedGraph.subgraphs[i].id;
      jsonModel.subgraphInterpolationType = calculatedGraph.subgraphs[i].interpolationType;
      jsonModel.subgraphKnots = calculatedGraph.subgraphs[i].knots;
      jsonModel.subgraphName = calculatedGraph.subgraphs[i].name;
      jsonModel.xAxisName = calculatedGraph.xAxisName;
      jsonModel.xAxisPoint = calculatedGraph.xAxisPoint;
      jsonModel.yAxisName = calculatedGraph.yAxisName;
      jsonModel.yAxisPoint = calculatedGraph.yAxisPoint;

      graphToJsonModel.push(jsonModel);     
    }

    const fileName = (this.imageFileToUpload ? this.imageFileToUpload.name.split('.')[0] : 'myfile') + '.json';

    this.jsonFileService.saveJsonFromGraphData(graphToJsonModel, fileName);
  }

  toggleOrigin(event: MouseEvent) {
    if(this.axisButtonActive)
    {
      event.stopPropagation();
      return;
    }

    this.axisButtonActive = true;
    this.pointButtonsState.origin = true;

    this.togglePointButton();
  }

  toggleXAxisPointButton(event: MouseEvent, index: number) {
    if(this.axisButtonActive)
    {
      event.stopPropagation();
      return;
    }

    this.axisButtonActive = true;
    this.pointButtonsState.xAxis = true;

    const eState = this.widget.getEditorState();
    eState.axisButtonsState = this.pointButtonsState;
    eState.axisPointIndex = index;
    this.widget.setEditorState(eState); 
  }

  toggleYAxisPointButton(buttonsState: ButtonsState, index: number) {
    if(this.axisButtonActive)
    {
      event.stopPropagation();
      return;
    }

    this.axisButtonActive = true;
    this.pointButtonsState.yAxis = true;

    const eState = this.widget.getEditorState();
    eState.axisButtonsState = this.pointButtonsState;
    eState.axisPointIndex = index;
    this.widget.setEditorState(eState); 
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

    //if(this.currentActivePanelId != undefined)
    //{
      const widgetState = new WidgetState();
      widgetState.subgraphId = this.currentActivePanelId;
      widgetState.interpolationType = eState.interpolationMethod as InterpolationType;
      widgetState.knots = eState.knots;
      widgetState.coordinates = eState.coordinates;
      widgetState.originPoint = eState.originPoint as Point;
      widgetState.xAxisPoints = eState.xAxisPoints as Point[];
      widgetState.yAxisPoints = eState.yAxisPoints as Point[];
      widgetState.axisPointIndex = eState.axisPointIndex;
  
      this.graphFormService.setSubgraphData(widgetState);
    //}
  }

  public widgetAxisPointSetEventHandler(index: number) {
    if(this.pointButtonsState.origin)
    {
      document.getElementById('btn_origin').classList.remove('active');
    }
    if(this.pointButtonsState.xAxis)
    {
      document.getElementById('btn_xAxis_' + index.toString()).classList.remove('active');
    }
    if(this.pointButtonsState.yAxis)
    {
      document.getElementById('btn_yAxis_' + index.toString()).classList.remove('active');
    }

    this.axisButtonActive = false;
    this.pointButtonsState.origin = false;
    this.pointButtonsState.xAxis = false;
    this.pointButtonsState.yAxis = false;

    this.togglePointButton();
  }

  private startup(initialEditorState: FunctionCurveEditor.EditorState) {
      const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("functionCurveEditor");
      this.widget = new FunctionCurveEditor.Widget(canvas, false);
      this.widget.setWidgetChangeEventHandler(()=> {this.widgetChangeEventHandler()});
      this.widget.setWidgetAxisPointSetEventHandler((x)=> {this.widgetAxisPointSetEventHandler(x)});
      this.widget.setEditorState(initialEditorState);
  }
}