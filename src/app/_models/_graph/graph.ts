import { Subgraph } from "./subgraph";
import { AxisPoint } from './point';

export class Graph{
    graphName: string;
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    subgraphs: Subgraph[];
    xAxisPoints: AxisPoint[];  
    yAxisPoints: AxisPoint[];  
}