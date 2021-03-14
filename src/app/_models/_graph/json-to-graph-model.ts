import { AxisPoint } from './point';
import { Subgraph } from './subgraph';

export class JsonToGraphModel{
    graphName: string;
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoints: AxisPoint[];
    yAxisPoints: AxisPoint[];
    subgraphs: Subgraph[];  
}