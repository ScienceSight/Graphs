import { AxisPoint, Point } from './point';
import { InterpolationType } from './interpolation-type';
import { XAxisPoint } from './x-axis-point';
import { YAxisPoint } from './y-axis-point';

export class GraphToJsonModel{
    subgraphId: number;
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoints: AxisPoint[];
    yAxisPoints: AxisPoint[];
    subgraphName: string;
    subgraphInterpolationType: InterpolationType;
    subgraphKnots: Point[];
    subgraphCoordinates: Point[];
}