import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormBuilder } from '@angular/forms'
import { Graph } from '../_graph/graph'

export class GraphForm {
    graphName = new UntypedFormControl();
    xAxisName = new UntypedFormControl();
    yAxisName = new UntypedFormControl();
    originPoint = new UntypedFormGroup({
        xCoordinate: new UntypedFormControl(),
        yCoordinate: new UntypedFormControl(),
        xValue: new UntypedFormControl(),
        yValue: new UntypedFormControl(),
      });
    subgraphs = new UntypedFormArray([]);
    xAxisPoints = new UntypedFormArray([]);
    yAxisPoints = new UntypedFormArray([]);

    constructor(graph: Graph) {
        if (graph.subgraphs) {
            this.subgraphs.setValue(graph.subgraphs);
        }

        if (graph.xAxisPoints) {
            this.xAxisPoints.setValue(graph.xAxisPoints);
        }

        if (graph.yAxisPoints) {
            this.yAxisPoints.setValue(graph.yAxisPoints);
        }

        if(graph.originPoint)
        {
            this.originPoint.setValue(graph.originPoint);
        }

        this.graphName.setValue(graph.graphName);
        this.xAxisName.setValue(graph.xAxisName);
        this.yAxisName.setValue(graph.yAxisName);
    }
}