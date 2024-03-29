import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms'
import { GraphFormService } from '../_services/_graph/graph-form.service'
import { Subscription } from 'rxjs'
import * as FunctionCurveEditor from "../function-curve-editor/Index";
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsState } from '../_models/_graph/buttons-state';
import { Graph } from '../_models/_graph';
import { InterpolationType } from '../_models/_graph/interpolation-type';
import { WidgetState } from '../_models/_widget/widget-state';
import { Point } from '../_models/_graph/point';
import { GraphMathService } from '../_services/_graph/graph-math.service';
import { JsonFileService } from '../_services/_file/json-file.service';
import { HttpService } from '../_services/_http/http.service';
import { JsonToGraphModel } from '../_models/_graph/json-to-graph-model';
import { CalculatedGraphModel } from '../_models/_graph/calculated-graph-model';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../_services/_config/configuration.service';

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  graphForm: UntypedFormGroup;
  graphFormSub: Subscription;
  subgraphs: UntypedFormArray;
  xAxisPoints: UntypedFormArray;
  yAxisPoints: UntypedFormArray;

  widget: FunctionCurveEditor.Widget;

  imageFileToUpload: File = null;
  jsonFileToUpload: File = null;

  imageFileUrl = "";
  jsonFileUrl = "";
  
  error = '';

  viewAllSubgraphsActive: boolean = false;
  axisButtonActive: boolean = false;

  currentActivePanelId: number = undefined;
  previousActivePanelId: number = undefined;

  pointButtonsState: ButtonsState = {
    origin: false,
    xAxis: false,
    yAxis: false
  };

  @ViewChild('acc') accordion: NgbAccordion;

  constructor(private graphFormService: GraphFormService,
              private graphMathService: GraphMathService,
              private jsonFileService: JsonFileService,
              private httpService: HttpService,
              private route: ActivatedRoute,
              private configuration: ConfigurationService) { }

  ngOnInit() {
    this.graphFormSub = this.graphFormService.graphForm$
      .subscribe(graph => {
        this.graphForm = graph
        this.subgraphs = this.graphForm.get('subgraphs') as UntypedFormArray
        this.xAxisPoints = this.graphForm.get('xAxisPoints') as UntypedFormArray
        this.yAxisPoints = this.graphForm.get('yAxisPoints') as UntypedFormArray
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

    this.route.queryParams.subscribe(params => {
      this.imageFileUrl = params['png'];
      this.jsonFileUrl = params['json'];
      if(this.imageFileUrl)
      {
        this.handleImageFileUrl(this.imageFileUrl);
      }
      if(this.jsonFileUrl)
      {
        this.handleJsonFileUrl(this.jsonFileUrl);
      }
    });
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

  handleImageFileUrl(url: string) {
    this.httpService.getFile(url)
      .subscribe({
        next: (blob: Blob) => {
          const blobType = 'image/png';
          if (blob.type == blobType) {
            this.imageFileToUpload = new File([blob], url.split('\/').pop(), { type: blobType });
            var reader = new FileReader();
            reader.onload = this._handleReaderLoadedImage.bind(this);
            reader.readAsBinaryString(this.imageFileToUpload);
          }
          else {
            this.error = 'Wrong file type';
          }
        },
        error: error => this.error = error.message,
      });
  }

  _handleReaderLoadedImage(readerEvt) {
    var binaryString = readerEvt.target.result;
    const base64textString = btoa(binaryString);
    this.widget.setConnected(true);
    this.widget.setWidgetContextImage(base64textString, this.imageFileToUpload.type);
    
    const length = this.graphFormService.getSubgraphsLength();
    if(this.currentActivePanelId == undefined
      && length == 1)
    {
      this.currentActivePanelId = 0;
      this.accordion.activeIds = this.currentActivePanelId.toString();
    }
  }

  handleJsonFileInput(files: FileList) {
    this.jsonFileToUpload = files.item(0);

    if (files && this.jsonFileToUpload) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoadedJson.bind(this);
      reader.readAsText(this.jsonFileToUpload);
    }
  }

  handleJsonFileUrl(url: string) {
    this.httpService.getFile(url)
      .subscribe({
        next: (blob: Blob) => {
          const blobType = 'application/json';
          if (blob.type == blobType) {
            this.jsonFileToUpload = new File([blob], url.split('\/').pop(), { type: blobType });
            var reader = new FileReader();
            reader.onload = this._handleReaderLoadedJson.bind(this);
            reader.readAsText(this.jsonFileToUpload);
          }
          else {
            this.error = 'Wrong file type';
          }
        },
        error: error => this.error = error.message,
      });
  }

  _handleReaderLoadedJson(readerEvt) {
    const jsonData = readerEvt.target.result;
    let jsonToGraphModel = new JsonToGraphModel();

    try {
      jsonToGraphModel = this.jsonFileService.loadGraphDataFromJsonString(jsonData);

      if (jsonToGraphModel == undefined
        || jsonToGraphModel.subgraphs == undefined
        || jsonToGraphModel.originPoint == undefined
        || jsonToGraphModel.xAxisPoints == undefined
        || jsonToGraphModel.yAxisPoints == undefined)
      {
        throw new Error('Invalid json structure.');
      }
    } catch (error) {
      this.error = error.message;
      throw error;
    }

    const calculatedGraph = this.graphMathService.calculateOriginGraph(jsonToGraphModel);
    console.log(calculatedGraph);

    this.graphFormService.setGraphData(calculatedGraph);

    const eState = this.widget.getEditorState();

    eState.originPoint = {x:calculatedGraph.originPoint.xCoordinate, y:calculatedGraph.originPoint.yCoordinate};

    eState.xAxisPoints = [];
    for (let i = 0; i < calculatedGraph.xAxisPoints.length; i++) {
      eState.xAxisPoints.push({x:calculatedGraph.xAxisPoints[i].xCoordinate, y:calculatedGraph.xAxisPoints[i].yCoordinate});    
    }

    eState.yAxisPoints = [];
    for (let i = 0; i < calculatedGraph.yAxisPoints.length; i++) {
      eState.yAxisPoints.push({x:calculatedGraph.yAxisPoints[i].xCoordinate, y:calculatedGraph.yAxisPoints[i].yCoordinate});    
    }

    this.currentActivePanelId = 0;
    this.accordion.activeIds = this.currentActivePanelId.toString();

    if(this.currentActivePanelId >= calculatedGraph.subgraphs.length)
    {
      eState.knots = [];
      this.widget.setConnected(false);
    }
    else
    {
      eState.knots = calculatedGraph.subgraphs[this.currentActivePanelId].knots;
      eState.interpolationMethod = calculatedGraph.subgraphs[this.currentActivePanelId].interpolationType;
      this.widget.setConnected(true);
    }

    this.widget.setEditorState(eState);  
  }

  checkViewAllSubgraphs(event: any)
  {
    if(event.currentTarget.checked)
    {
      this.viewAllSubgraphsActive = true;
    }
    else
    {
      this.viewAllSubgraphsActive = false;
    }

    const eState = this.widget.getEditorState();
    const graphData = this.graphForm.value as Graph;
    eState.curvesState = this.graphFormService.getSubgraphsState(graphData.subgraphs);
    eState.viewAllOptionActive = this.viewAllSubgraphsActive;
    this.widget.setEditorState(eState); 
  }

  saveGraphLocally() {
    const data = this.getFixedCalculatedGraph();
    const fileName = (this.imageFileToUpload ? this.imageFileToUpload.name.split('.')[0] : 'myfile') + '.json';   
    this.jsonFileService.saveJsonFromGraphData(data, fileName);
  }

  saveGraphRemotely() {
    const url = this.configuration.getValue('postGraphDataUrl');
    if (!url)
    {
      this.error = 'Empty remote endpoint url.';
      return;
    }
    const data = this.getFixedCalculatedGraph();
    this.httpService.postGraphData(url, data)
      .subscribe({
        next: (response: any) => {
          if (response.error) {
            this.error = response.error;
          }
          else if (response.redirect) {
            window.location.href = response.redirect;
          }
          else {
            this.error = 'Invalid response from upload endpoint.';
          }
        },
        error: error => this.error = error.message,
      });
  }

  getFixedCalculatedGraph() : CalculatedGraphModel {
    const graphData = this.graphForm.value as Graph;
    const calculatedGraph = this.graphMathService.calculateResultGraph(graphData);
    return calculatedGraph.toFixed(8);
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

  toggleYAxisPointButton(event: MouseEvent, index: number) {
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