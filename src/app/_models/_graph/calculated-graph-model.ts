import { Subgraph } from "./subgraph";
import { AxisPoint } from './point';

export class CalculatedGraphModel{
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoint: AxisPoint;
    yAxisPoint: AxisPoint;
    subgraphs: Subgraph[];  
}