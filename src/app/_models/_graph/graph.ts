import { Subgraph } from "./subgraph";
import { AxisPoint } from './point';

export class Graph{
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoint: AxisPoint;
    yAxisPoint: AxisPoint;
    subgraphs: Subgraph[];  
}