import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray, Validators, Form, AbstractControl } from '@angular/forms'
import { Subgraph, Graph } from '../../_models/_graph'
import { SubgraphForm, GraphForm } from '../../_models/_forms'
import { InterpolationType } from 'src/app/_models/_graph/interpolation-type'
import { Point } from 'src/app/_models/_graph/point'
import { WidgetState } from 'src/app/_models/_widget/widget-state'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'

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
      subgraph.controls['knots'].setValue(state.knots);
      subgraph.controls['coordinates'].setValue(state.coordinates);
    }    
  }
  
  setAxisPoints(state: WidgetState) {
    const currentGraph = this.graphForm.getValue()
    
    if(state.originPoint != null)
    {
      (currentGraph.controls['originPoint'] as FormGroup).controls['xCoordinate'].setValue(state.originPoint.x);
      (currentGraph.controls['originPoint'] as FormGroup).controls['yCoordinate'].setValue(state.originPoint.y);  
    }

    if(state.xAxisPoint != null)
    {
      (currentGraph.controls['xAxisPoint'] as FormGroup).controls['xCoordinate'].setValue(state.xAxisPoint.x);
      (currentGraph.controls['xAxisPoint'] as FormGroup).controls['yCoordinate'].setValue(state.xAxisPoint.y);  
    }

    if(state.yAxisPoint != null)
    {
      (currentGraph.controls['yAxisPoint'] as FormGroup).controls['xCoordinate'].setValue(state.yAxisPoint.x);
      (currentGraph.controls['yAxisPoint'] as FormGroup).controls['yCoordinate'].setValue(state.yAxisPoint.y);  
    }
  }

  getSubgraphData(currentActivePanelId: number) : WidgetState {
    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
    const subgraph = currentSubgraphs.get(currentActivePanelId.toString()) as FormGroup;

    const widgetState = new WidgetState();
    widgetState.interpolationType = subgraph.controls['interpolationType'].value as InterpolationType;
    widgetState.knots = subgraph.controls['knots'].value as Point[];
    
    return widgetState;
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

  getCurrentSubgraph(i: string) {
    const currentGraph = this.graphForm.getValue()
    const currentSubgraphs = currentGraph.get('subgraphs') as FormArray
    
    return currentSubgraphs.get('0');
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

    if(calculatedGraph.xAxisPoint)
    {
      (currentGraph.controls['xAxisPoint'] as FormGroup).controls['xValue'].setValue(calculatedGraph.xAxisPoint.xValue);
      (currentGraph.controls['xAxisPoint'] as FormGroup).controls['xCoordinate'].setValue(calculatedGraph.xAxisPoint.xCoordinate);
      (currentGraph.controls['xAxisPoint'] as FormGroup).controls['yCoordinate'].setValue(calculatedGraph.xAxisPoint.yCoordinate);  
    }

    if(calculatedGraph.yAxisPoint)
    {
      (currentGraph.controls['yAxisPoint'] as FormGroup).controls['yValue'].setValue(calculatedGraph.yAxisPoint.yValue); 
      (currentGraph.controls['yAxisPoint'] as FormGroup).controls['xCoordinate'].setValue(calculatedGraph.yAxisPoint.xCoordinate);
      (currentGraph.controls['yAxisPoint'] as FormGroup).controls['yCoordinate'].setValue(calculatedGraph.yAxisPoint.yCoordinate);  
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
        subgraph.coordinates = calculatedGraph.subgraphs[i].coordinates;
        
        currentSubgraphs.push(
          this.fb.group(
            new SubgraphForm(subgraph)
          )
        )
      }
    }
  }
}