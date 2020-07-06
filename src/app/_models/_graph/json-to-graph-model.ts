import { AxisPoint, Point } from './point';
import { InterpolationType } from './interpolation-type';
import { Subgraph } from './subgraph';

export class JsonToGraphModel{
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoints: AxisPoint[];
    yAxisPoints: AxisPoint[];
    subgraphs: Subgraph[];  
}