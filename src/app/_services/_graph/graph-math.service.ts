import { Injectable } from '@angular/core'
import { Subgraph, Graph } from '../../_models/_graph'
import { Point, AxisPoint } from 'src/app/_models/_graph/point'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'

@Injectable()
export class GraphMathService {
    private pixelWeight: number;
    
    constructor() { }

    public calculateResultGraph(data: Graph) : CalculatedGraphModel {
        const calculatedGraph = new CalculatedGraphModel();

        calculatedGraph.subgraphs = Array<Subgraph>();

        calculatedGraph.originPoint = data.originPoint;
        calculatedGraph.xAxisName = data.xAxisName;
        calculatedGraph.xAxisPoint = data.xAxisPoint;
        calculatedGraph.yAxisName = data.yAxisName;
        calculatedGraph.yAxisPoint = data.yAxisPoint;

        const xAxisPixelWeight = this.calculatePixelWeightX(data.originPoint, data.xAxisPoint);
        const yAxisPixelWeight = this.calculatePixelWeightY(data.originPoint, data.yAxisPoint);

        for (let i = 0; i < data.subgraphs.length; i++) {
            const subgraph = new Subgraph();
      
            subgraph.id = data.subgraphs[i].id;
            subgraph.interpolationType = data.subgraphs[i].interpolationType;
            subgraph.name = data.subgraphs[i].name;
            subgraph.knots = data.subgraphs[i].knots;

            if(data.subgraphs[i].coordinates)
            {
                subgraph.coordinates = this.calculateCoordinates(
                    data.subgraphs[i].coordinates,
                    data.originPoint,
                    xAxisPixelWeight,
                    yAxisPixelWeight);
            }

            calculatedGraph.subgraphs.push(subgraph);     
          }

        return calculatedGraph;
    }

    private calculatePixelWeightX(originPoint: AxisPoint, xAxisPoint: AxisPoint) : number {
        return (xAxisPoint.xValue - originPoint.xValue) / (xAxisPoint.xCoordinate - originPoint.xCoordinate);
    }

    private calculatePixelWeightY(originPoint: AxisPoint, yAxisPoint: AxisPoint) : number {
        return (yAxisPoint.yValue - originPoint.yValue) / (yAxisPoint.yCoordinate - originPoint.yCoordinate); 
    }

    calculateCoordinates(coordinates: Point[], originPoint: AxisPoint, xAxisPixelWeight: number, yAxisPixelWeight: number) : Point[] {
        const result = Array<Point>();

        for (let i = 0; i < coordinates.length; i++) {
            const x = (coordinates[i].x - originPoint.xCoordinate) * xAxisPixelWeight + originPoint.xValue;
            const y = (coordinates[i].y - originPoint.yCoordinate) * yAxisPixelWeight + originPoint.yValue;
            result.push({x:x, y:y});
        }

        return result;
    }
}