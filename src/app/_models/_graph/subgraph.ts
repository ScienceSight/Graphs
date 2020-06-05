import { InterpolationType } from "./interpolation-type";
import { Point } from "./point";

export class Subgraph{
    id: number;
    interpolationType: InterpolationType;
    name: string;
    knots: Point[];
    coordinates: Point[];
}