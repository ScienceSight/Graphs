import { Injectable } from '@angular/core'
import { Subgraph, Graph } from '../../_models/_graph'
import { Point, AxisPoint } from 'src/app/_models/_graph/point'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'
import { JsonToGraphModel } from 'src/app/_models/_graph/json-to-graph-model';

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
                subgraph.coordinates = this.calculateResultCoordinates(
                    data.subgraphs[i].coordinates,
                    data.originPoint,
                    xAxisPixelWeight,
                    yAxisPixelWeight);
            }

            calculatedGraph.subgraphs.push(subgraph);     
          }

        return calculatedGraph;
    }

    public calculateOriginGraph(data: JsonToGraphModel[]) : CalculatedGraphModel {
        const calculatedGraph = new CalculatedGraphModel();

        calculatedGraph.subgraphs = Array<Subgraph>();

        if(data)
        {
            calculatedGraph.originPoint = data[0]?.originPoint;
            calculatedGraph.xAxisName = data[0]?.xAxisName;
            calculatedGraph.xAxisPoint = data[0]?.xAxisPoint;
            calculatedGraph.yAxisName = data[0]?.yAxisName;
            calculatedGraph.yAxisPoint = data[0]?.yAxisPoint;

            const xAxisPixelWeight = this.calculatePixelWeightX(data[0]?.originPoint, data[0]?.xAxisPoint);
            const yAxisPixelWeight = this.calculatePixelWeightY(data[0]?.originPoint, data[0]?.yAxisPoint);

            for (let i = 0; i < data.length; i++) {
                const subgraph = new Subgraph();
          
                subgraph.id = data[i].subgraphId;
                subgraph.interpolationType = data[i].subgraphInterpolationType;
                subgraph.name = data[i].subgraphName;
                subgraph.knots = data[i].subgraphKnots;
                
                if(data[i].subgraphCoordinates)
                {
                    subgraph.coordinates = this.calculateOriginCoordinates(
                    data[i].subgraphCoordinates,
                    data[i]?.originPoint,
                    xAxisPixelWeight,
                    yAxisPixelWeight);
                }
    
                calculatedGraph.subgraphs.push(subgraph);     
              }
        }

        return calculatedGraph;
    }

    private calculatePixelWeightX(originPoint: AxisPoint, xAxisPoint: AxisPoint) : number {
        return (xAxisPoint.xValue - originPoint.xValue) / (xAxisPoint.xCoordinate - originPoint.xCoordinate);
    }

    private calculatePixelWeightY(originPoint: AxisPoint, yAxisPoint: AxisPoint) : number {
        return (yAxisPoint.yValue - originPoint.yValue) / (yAxisPoint.yCoordinate - originPoint.yCoordinate); 
    }

    calculateResultCoordinates(coordinates: Point[], originPoint: AxisPoint, xAxisPixelWeight: number, yAxisPixelWeight: number) : Point[] {
        const result = Array<Point>();

        for (let i = 0; i < coordinates.length; i++) {
            const x = (coordinates[i].x - originPoint.xCoordinate) * xAxisPixelWeight + originPoint.xValue;
            const y = (coordinates[i].y - originPoint.yCoordinate) * yAxisPixelWeight + originPoint.yValue;
            result.push({x:x, y:y});
        }

        return result;
    }

    calculateOriginCoordinates(coordinates: Point[], originPoint: AxisPoint, xAxisPixelWeight: number, yAxisPixelWeight: number) : Point[] {
        const result = Array<Point>();

        for (let i = 0; i < coordinates.length; i++) {
            const x = (coordinates[i].x - originPoint.xValue) / xAxisPixelWeight + originPoint.xCoordinate;
            const y = (coordinates[i].y - originPoint.yValue) / yAxisPixelWeight + originPoint.yCoordinate;
            result.push({x:x, y:y});
        }

        return result;
    }
}