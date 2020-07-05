import { Subgraph } from "./subgraph";
import { AxisPoint } from './point';
import { XAxisPoint } from './x-axis-point';
import { YAxisPoint } from './y-axis-point';

export class Graph{
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoint: AxisPoint;
    yAxisPoint: AxisPoint;
    subgraphs: Subgraph[];
    xAxisPoints: XAxisPoint[];  
    yAxisPoints: YAxisPoint[];  
}