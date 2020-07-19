import { Point } from './point';
import { InterpolationType } from './interpolation-type';

export interface SubgraphState {
    knots: Point[];
    interpolationMethod: InterpolationType;
 }