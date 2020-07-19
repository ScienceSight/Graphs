import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray, Validators, Form, AbstractControl } from '@angular/forms'
import { Subgraph, Graph } from '../../_models/_graph'
import { SubgraphForm, GraphForm } from '../../_models/_forms'
import { InterpolationType } from 'src/app/_models/_graph/interpolation-type'
import { Point, AxisPoint } from 'src/app/_models/_graph/point'
import { WidgetState } from 'src/app/_models/_widget/widget-state'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'
import { XAxisPointForm } from 'src/app/_models/_forms/x-axis-point-form'
import { XAxisPoint } from 'src/app/_models/_graph/x-axis-point'
import { YAxisPoint } from 'src/app/_models/_graph/y-axis-point'
import { YAxisPointForm } from 'src/app/_models/_forms/y-axis-point-form'
import { SubgraphState } from 'src/app/_models/_graph/subgraph-state'

@Injectable()
export class GraphFormService {
  private graphForm: BehaviorSubject<
    FormGroup | undefined
  > = new BehaviorSubject(this.fb.group(new GraphForm(new Graph())))
  graphForm$: Observable<FormGroup> = this.graphForm.asObservable()

  constructor(private fb: FormBuilder) {}

   setSubgraphData(state: WidgetState) {
    this.setAxisPoints(state);
  
    if(state.subgraphId != undefined)
    {
      const currentGraph = this.graphForm.getValue()
      const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
      const subgraph = currentSubgraphs.get(state.subgraphId.toString()) as FormGroup;
      if(subgraph)
      {
        subgraph.controls['knots'].setValue(state.knots);
        subgraph.controls['coordinates'].setValue(state.coordinates);
      }
    }    
  }
  
  setAxisPoints(state: WidgetState) {
    const currentGraph = this.graphForm.getValue()
    const currentXAxisPoints = currentGraph.get('xAxisPoints') as FormArray
    const currentYAxisPoints = currentGraph.get('yAxisPoints') as FormArray

    const index = state.axisPointIndex;

    const xAxisPoint = currentXAxisPoints.get(index.toString()) as FormGroup;
    const yAxisPoint = currentYAxisPoints.get(index.toString()) as FormGroup;
    
    if(state.originPoint)
    {
      (currentGraph.controls['originPoint'] as FormGroup).controls['xCoordinate'].setValue(state.originPoint.x);
      (currentGraph.controls['originPoint'] as FormGroup).controls['yCoordinate'].setValue(state.originPoint.y);  
    }

    if(xAxisPoint && state.xAxisPoints[index])
    {
      xAxisPoint.controls['xCoordinate'].setValue(state.xAxisPoints[index].x);
      xAxisPoint.controls['yCoordinate'].setValue(state.xAxisPoints[index].y);
    }

    if(yAxisPoint && state.yAxisPoints[index])
    {
      yAxisPoint.controls['xCoordinate'].setValue(state.yAxisPoints[index].x);
      yAxisPoint.controls['yCoordinate'].setValue(state.yAxisPoints[index].y);
    }
  }

  getSubgraphData(currentActivePanelId: number) : WidgetState {
    const widgetState = new WidgetState();

    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
    const subgraph = currentSubgraphs.get(currentActivePanelId.toString()) as FormGroup;

    if(subgraph)
    {
      widgetState.interpolationType = subgraph.controls['interpolationType'].value as InterpolationType;
      widgetState.knots = subgraph.controls['knots'].value as Point[];
    }
    
    return widgetState;
  }

  getSubgraphsState(subgraphs: Subgraph[]) : SubgraphState[]{
    const states = new Array<SubgraphState>();

    subgraphs.forEach(subgraph => {
      const knots = new Array<Point>();
      const interpolationMethod = subgraph.interpolationType;

      if(subgraph.knots && subgraph.interpolationType)
      {
        subgraph.knots.forEach(point => {
          knots.push({x:point.x, y:point.y});
        });
      }

      states.push({knots: knots, interpolationMethod: interpolationMethod});
    });

    return states;
  }

  addSubgraph() {
    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray

    currentSubgraphs.push(
      this.fb.group(
        new SubgraphForm(new Subgraph())
      )
    )

    this.graphForm.next(currentGraph)
  }

  deleteSubgraph(i: number) {
    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray

    currentSubgraphs.removeAt(i)

    this.graphForm.next(currentGraph)
  }

  getSubgraphsLength() {
    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
    
    return currentSubgraphs.length;
  }

  setGraphData(calculatedGraph: CalculatedGraphModel)
  {
    const currentGraph = this.graphForm.getValue();
    currentGraph.reset();
    
    if(calculatedGraph.xAxisName)
    {
      currentGraph.controls['xAxisName'].setValue(calculatedGraph.xAxisName);
    }

    if(calculatedGraph.yAxisName)
    {
      currentGraph.controls['yAxisName'].setValue(calculatedGraph.yAxisName);
    }

    if(calculatedGraph.originPoint)
    {
      (currentGraph.controls['originPoint'] as FormGroup).controls['xValue'].setValue(calculatedGraph.originPoint.xValue);
      (currentGraph.controls['originPoint'] as FormGroup).controls['yValue'].setValue(calculatedGraph.originPoint.yValue);
      (currentGraph.controls['originPoint'] as FormGroup).controls['xCoordinate'].setValue(calculatedGraph.originPoint.xCoordinate);
      (currentGraph.controls['originPoint'] as FormGroup).controls['yCoordinate'].setValue(calculatedGraph.originPoint.yCoordinate);  
    }

    if(calculatedGraph.xAxisPoints)
    {
      const currentXAxisPoints = currentGraph.get('xAxisPoints') as FormArray
      currentXAxisPoints.clear();

      for (let i = 0; i < calculatedGraph.xAxisPoints.length; i++) {
        let xAxisPoint = new XAxisPoint();

        xAxisPoint.xValue = calculatedGraph.xAxisPoints[i].xValue;
        xAxisPoint.xCoordinate = calculatedGraph.xAxisPoints[i].xCoordinate;
        xAxisPoint.yCoordinate = calculatedGraph.xAxisPoints[i].yCoordinate;
        xAxisPoint.isLogScale = calculatedGraph.xAxisPoints[i].isLogScale;
        xAxisPoint.logBase = calculatedGraph.xAxisPoints[i].logBase;
 
        currentXAxisPoints.push(
          this.fb.group(
            new XAxisPointForm(xAxisPoint)
          )
        )
      }
    }

    if(calculatedGraph.yAxisPoints)
    {
      const currentYAxisPoints = currentGraph.get('yAxisPoints') as FormArray
      currentYAxisPoints.clear();

      for (let i = 0; i < calculatedGraph.yAxisPoints.length; i++) {
        let yAxisPoint = new YAxisPoint();

        yAxisPoint.yValue = calculatedGraph.yAxisPoints[i].yValue;
        yAxisPoint.xCoordinate = calculatedGraph.yAxisPoints[i].xCoordinate;
        yAxisPoint.yCoordinate = calculatedGraph.yAxisPoints[i].yCoordinate;
        yAxisPoint.isLogScale = calculatedGraph.yAxisPoints[i].isLogScale;
        yAxisPoint.logBase = calculatedGraph.yAxisPoints[i].logBase;
 
        currentYAxisPoints.push(
          this.fb.group(
            new YAxisPointForm(yAxisPoint)
          )
        )
      }  
    }

    if(calculatedGraph.subgraphs)
    {
      const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
      currentSubgraphs.clear();

      for (let i = 0; i < calculatedGraph.subgraphs.length; i++) {
        const subgraph = new Subgraph();
        const stringEnum = calculatedGraph.subgraphs[i].interpolationType.charAt(0).toUpperCase() + 
          calculatedGraph.subgraphs[i].interpolationType.slice(1);

        subgraph.id = i;
        subgraph.name = calculatedGraph.subgraphs[i].name;
        subgraph.interpolationType = 
          InterpolationType[stringEnum as keyof typeof InterpolationType];
        subgraph.knots = calculatedGraph.subgraphs[i].knots;
        subgraph.coordinates = calculatedGraph.subgraphs[i].tempCoordinates;
        
        currentSubgraphs.push(
          this.fb.group(
            new SubgraphForm(subgraph)
          )
        )
      }
    }
  }

  addXAxisPoint() {
    const currentGraph = this.graphForm.getValue()
    const currentXAxisPoints = currentGraph.get('xAxisPoints') as FormArray

    currentXAxisPoints.push(
      this.fb.group(
        new XAxisPointForm(new XAxisPoint())
      )
    )

    currentGraph.controls['xAxisPoints'].setErrors({'incorrect': true});

    this.graphForm.next(currentGraph)
  }

  addYAxisPoint() {
    const currentGraph = this.graphForm.getValue()
    const currentYAxisPoints = currentGraph.get('yAxisPoints') as FormArray

    currentYAxisPoints.push(
      this.fb.group(
        new YAxisPointForm(new YAxisPoint())
      )
    )

    currentGraph.controls['yAxisPoints'].setErrors({'incorrect': true});

    this.graphForm.next(currentGraph)
  }

  deleteXAxisPoint(i: number) {
    const currentGraph = this.graphForm.getValue()
    const currentXAxisPoints = currentGraph.get('xAxisPoints') as FormArray

    currentXAxisPoints.removeAt(i)

    this.graphForm.next(currentGraph)
  }

  deleteYAxisPoint(i: number) {
    const currentGraph = this.graphForm.getValue()
    const currentYAxisPoints = currentGraph.get('yAxisPoints') as FormArray

    currentYAxisPoints.removeAt(i)

    this.graphForm.next(currentGraph)
  }
}