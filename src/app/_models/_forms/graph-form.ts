import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { Graph } from '../_graph/graph'

export class GraphForm {
    xAxisName = new FormControl()
    yAxisName = new FormControl()
    originPoint = new FormGroup({
        xCoordinate: new FormControl(),
        yCoordinate: new FormControl(),
        xValue: new FormControl(),
        yValue: new FormControl(),
      });
    subgraphs = new FormArray([])
    xAxisPoints = new FormArray([])
    yAxisPoints = new FormArray([])

    constructor(graph: Graph) {
        if (graph.subgraphs) {
            this.subgraphs.setValue(graph.subgraphs)
        }

        if (graph.xAxisPoints) {
            this.xAxisPoints.setValue(graph.xAxisPoints)
        }

        if (graph.yAxisPoints) {
            this.yAxisPoints.setValue(graph.yAxisPoints)
        }

        if(graph.originPoint)
        {
            this.originPoint.setValue(graph.originPoint);
        }

        this.xAxisName.setValue(graph.xAxisName)
        this.yAxisName.setValue(graph.yAxisName)
    }
}