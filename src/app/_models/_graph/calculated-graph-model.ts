import { Subgraph } from "./subgraph";
import { AxisPoint } from './point';

export class CalculatedGraphModel{
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoints: AxisPoint[];
    yAxisPoints: AxisPoint[];
    subgraphs: Subgraph[];  
}