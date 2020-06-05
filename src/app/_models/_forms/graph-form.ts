import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { Graph } from '../_graph/graph'
import { AxisPointForm } from './axis-point-form'
import { AxisPoint } from '../_graph/point'

export class GraphForm {
    xAxisName = new FormControl()
    yAxisName = new FormControl()
    originPoint = new FormGroup({
        xCoordinate: new FormControl(),
        yCoordinate: new FormControl(),
        xValue: new FormControl(),
        yValue: new FormControl(),
      });
    xAxisPoint = new FormGroup({
        xCoordinate: new FormControl(),
        yCoordinate: new FormControl(),
        xValue: new FormControl(),
       // yValue: new FormControl(''),
      });
    yAxisPoint = new FormGroup({
        xCoordinate: new FormControl(),
        yCoordinate: new FormControl(),
        //xValue: new FormControl(''),
        yValue: new FormControl(),
      });
    subgraphs = new FormArray([])

    constructor(graph: Graph) {
        if (graph.subgraphs) {
            this.subgraphs.setValue(graph.subgraphs)
        }

        if(graph.originPoint)
        {
            this.originPoint.setValue(graph.originPoint);
        }

        if(graph.xAxisPoint)
        {
            this.xAxisPoint.setValue(graph.xAxisPoint);
        }

        if(graph.yAxisPoint)
        {
            this.yAxisPoint.setValue(graph.yAxisPoint);
        }

        // if(graph.xAxisName)
        // {
        //     this.xAxisName.setValue(graph.xAxisName)
        // }

        this.xAxisName.setValue(graph.xAxisName)
        //this.xAxisName.setValidators([Validators.required])

        this.yAxisName.setValue(graph.yAxisName)
        //this.yAxisName.setValidators([Validators.required])

        //this.originPoint.setValue(graph.originPoint)
        //this.originPoint.setValidators([Validators.required])

        //this.xAxisPoint.setValue(graph.xAxisPoint)
        //this.xAxisPoint.setValidators([Validators.required])

        //this.yAxisPoint.setValue(graph.yAxisPoint)
        //this.yAxisPoint.setValidators([Validators.required])
    }
}