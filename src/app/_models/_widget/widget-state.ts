import { AxisPoint, Point } from '../_graph/point';
import { InterpolationType } from '../_graph/interpolation-type';

export class WidgetState{
    subgraphId: number;
    xAxisName: string;
    yAxisName: string;
    originPoint: Point;
    xAxisPoints: Point[];
    yAxisPoints: Point[];
    axisPointIndex: number;
    interpolationType: InterpolationType;
    knots: Point[];
    coordinates: Point[];
}