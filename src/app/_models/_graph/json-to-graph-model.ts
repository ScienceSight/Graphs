import { AxisPoint, Point } from './point';
import { InterpolationType } from './interpolation-type';

export class JsonToGraphModel{
    subgraphId: number;
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoint: AxisPoint;
    yAxisPoint: AxisPoint;
    subgraphName: string;
    subgraphInterpolationType: InterpolationType;
    subgraphKnots: Point[];
    subgraphCoordinates: Point[];
}