import { Injectable } from '@angular/core'
import { Subgraph, Graph } from '../../_models/_graph'
import { Point, AxisPoint } from 'src/app/_models/_graph/point'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'
import { JsonToGraphModel } from 'src/app/_models/_graph/json-to-graph-model';

@Injectable()
export class GraphMathService {    
    constructor() { }

    public calculateResultGraph(data: Graph) : CalculatedGraphModel {
        const calculatedGraph = new CalculatedGraphModel();

        calculatedGraph.subgraphs = Array<Subgraph>();       
        calculatedGraph.xAxisName = data.xAxisName;
        calculatedGraph.yAxisName = data.yAxisName;
        calculatedGraph.originPoint = data.originPoint;
        calculatedGraph.xAxisPoints = this.setXAxisPoints(data);
        calculatedGraph.yAxisPoints = this.setYAxisPoints(data);


        const xAxisPixelWeights = this.calculatePixelWeightsX(data.originPoint, data.xAxisPoints);
        const yAxisPixelWeights = this.calculatePixelWeightsY(data.originPoint, data.yAxisPoints);

        for (let i = 0; i < data.subgraphs.length; i++) {
            const subgraph = new Subgraph();
      
            subgraph.id = data.subgraphs[i].id;
            subgraph.interpolationType = data.subgraphs[i].interpolationType;
            subgraph.name = data.subgraphs[i].name;
            subgraph.knots = data.subgraphs[i].knots;
            subgraph.tempCoordinates = data.subgraphs[i].coordinates;

            if(data.subgraphs[i].coordinates)
            {
                subgraph.coordinates = this.calculateResultCoordinates(
                    data,
                    i,
                    xAxisPixelWeights,
                    yAxisPixelWeights);
            }

            calculatedGraph.subgraphs.push(subgraph);     
          }

        return calculatedGraph;
    }

    public calculateOriginGraph(data: JsonToGraphModel) : CalculatedGraphModel {
        const calculatedGraph = new CalculatedGraphModel();

        calculatedGraph.subgraphs = Array<Subgraph>();
        calculatedGraph.xAxisPoints = Array<AxisPoint>();
        calculatedGraph.yAxisPoints = Array<AxisPoint>();

        if(data)
        {
            calculatedGraph.xAxisName = data.xAxisName;
            calculatedGraph.yAxisName = data.yAxisName;
            calculatedGraph.originPoint = data.originPoint;
            calculatedGraph.xAxisPoints = data.xAxisPoints;
            calculatedGraph.yAxisPoints = data.yAxisPoints;
            calculatedGraph.subgraphs = data.subgraphs;

            // const xAxisPixelWeights = this.calculatePixelWeightsX(data.originPoint, data.xAxisPoints);
            // const yAxisPixelWeights = this.calculatePixelWeightsY(data.originPoint, data.yAxisPoints);

            // for (let i = 0; i < data.subgraphs.length; i++) {
            //     const subgraph = new Subgraph();
          
            //     subgraph.id = data.subgraphs[i].id;
            //     subgraph.interpolationType = data.subgraphs[i].interpolationType;
            //     subgraph.name = data.subgraphs[i].name;
            //     subgraph.knots = data.subgraphs[i].knots;
                
            //     if(data.subgraphs[i].coordinates)
            //     {
            //         subgraph.coordinates = this.calculateOriginCoordinates(
            //             data,
            //             i,
            //             xAxisPixelWeights,
            //             yAxisPixelWeights);
            //     }
    
            //     calculatedGraph.subgraphs.push(subgraph);     
            //   }
        }

        return calculatedGraph;
    }

    private setXAxisPoints(data: Graph): AxisPoint[] {
        const xAxisPoints = Array<AxisPoint>();

        data.xAxisPoints.forEach(x => {
            xAxisPoints.push(x);
        });

        xAxisPoints.sort(x=>x.xCoordinate);

        return xAxisPoints;
    }

    private setYAxisPoints(data: Graph): AxisPoint[] {
        const yAxisPoints = Array<AxisPoint>();

        data.yAxisPoints.forEach(y => {
            yAxisPoints.push(y);
        });

        yAxisPoints.sort(y=>y.yCoordinate);

        return yAxisPoints;
    }

    private calculatePixelWeightsX(originPoint: AxisPoint, xAxisPoints: AxisPoint[]) : number[] {
        const pixelWeights = Array<number>();

        for (let i = 0; i < xAxisPoints.length; i++) {
            let value: number;

            if(i==0)
            {
                value = (xAxisPoints[i].xValue - originPoint.xValue) / (xAxisPoints[i].xCoordinate - originPoint.xCoordinate);
            }
            else
            {
                value = (xAxisPoints[i].xValue - xAxisPoints[i-1].xValue) / (xAxisPoints[i].xCoordinate - xAxisPoints[i-1].xCoordinate);
            }

            pixelWeights.push(value);
        }

        // xAxisPoints.forEach(x => {
        //     const value = (x.xValue - originPoint.xValue) / (x.xCoordinate - originPoint.xCoordinate);
        //     pixelWeights.push(value);
        // });
       // return (xAxisPoint.xValue - originPoint.xValue) / (xAxisPoint.xCoordinate - originPoint.xCoordinate);

        return pixelWeights;
    }

    private calculatePixelWeightsY(originPoint: AxisPoint, yAxisPoints: AxisPoint[]) : number[] {
        const pixelWeights = Array<number>();

        for (let i = 0; i < yAxisPoints.length; i++) {
            let value: number;

            if(i==0)
            {
                value = (yAxisPoints[i].yValue - originPoint.yValue) / (yAxisPoints[i].yCoordinate - originPoint.yCoordinate);
            }
            else
            {
                value = (yAxisPoints[i].yValue - yAxisPoints[i-1].yValue) / (yAxisPoints[i].yCoordinate - yAxisPoints[i-1].yCoordinate);
            }

            pixelWeights.push(value);
        }

        //return (yAxisPoint.yValue - originPoint.yValue) / (yAxisPoint.yCoordinate - originPoint.yCoordinate); 

        return pixelWeights;
    }

    private calculateResultCoordinates(
        data: Graph,
        index: number,
        xAxisPixelWeights: number[], 
        yAxisPixelWeights: number[]) : Point[] 
    {
        const result = Array<Point>();

        const coordinates = data.subgraphs[index].coordinates;
        const originPoint = data.originPoint;

        for (let i = 0; i < coordinates.length; i++) {
            const xWeight = this.currentXWeight(data.xAxisPoints, xAxisPixelWeights, coordinates[i]);
            const yWeight = this.currentYWeight(data.yAxisPoints, yAxisPixelWeights, coordinates[i]);
            const xAxisIndex = this.currentXAxisIndex(data.xAxisPoints, coordinates[i]);
            const yAxisIndex = this.currentYAxisIndex(data.yAxisPoints, coordinates[i]);

            let x = 0;
            let y = 0;

            if(xAxisIndex==0)
            {
                x = (coordinates[i].x - originPoint.xCoordinate) * xWeight + originPoint.xValue;
            }
            else
            {
                x = (coordinates[i].x - data.xAxisPoints[xAxisIndex].xCoordinate) * xWeight + data.xAxisPoints[xAxisIndex].xValue;
            }

            if(yAxisIndex==0)
            {
                y = (coordinates[i].y - originPoint.yCoordinate) * yWeight + originPoint.yValue;
            }
            else
            {
                y = (coordinates[i].y - data.yAxisPoints[yAxisIndex].yCoordinate) * yWeight + data.yAxisPoints[yAxisIndex].yValue;
            }

            // const x = (coordinates[i].x - originPoint.xCoordinate) * xWeight + originPoint.xValue;
            // const y = (coordinates[i].y - originPoint.yCoordinate) * yWeight + originPoint.yValue;

            result.push({x:x, y:y});
        }

        return result;
    }
    
    private currentXWeight(xAxisPoints: AxisPoint[], xAxisPixelWeights: number[], coordinate: Point) {
        let xWeight = 0;

        for (let i = 0; i < xAxisPoints.length; i++) {
            const point = xAxisPoints[i];
            xWeight = xAxisPixelWeights[i];
            
            if(coordinate.x < point.xCoordinate)
            {
                break;
            }
        }

        return xWeight;
    }

    private currentYWeight(yAxisPoints: AxisPoint[], yAxisPixelWeights: number[], coordinate: Point) {
        let yWeight = 0;

        for (let i = 0; i < yAxisPoints.length; i++) {
            const point = yAxisPoints[i];
            yWeight = yAxisPixelWeights[i];
            
            if(coordinate.y < point.yCoordinate)
            {
                break;
            }
        }

        return yWeight;
    }

    private currentXAxisIndex(xAxisPoints: AxisPoint[], coordinate: Point) {
        let index = 0;

        for (let i = 0; i < xAxisPoints.length; i++) {
            const point = xAxisPoints[i];
            index = i;
            
            if(coordinate.x < point.xCoordinate)
            {
                break; 
            }
        }

        return index;
    }

    private currentYAxisIndex(yAxisPoints: AxisPoint[], coordinate: Point) {
        let index = 0;

        for (let i = 0; i < yAxisPoints.length; i++) {
            const point = yAxisPoints[i];
            index = i;

            if(coordinate.y < point.yCoordinate)
            {
                break;
            }
        }

        return index;
    }

    private calculateOriginCoordinates(
        data: JsonToGraphModel,
        index: number,
        xAxisPixelWeights: number[], 
        yAxisPixelWeights: number[]) : Point[] 
    {
        const result = Array<Point>();

        const coordinates = data.subgraphs[index].coordinates;
        const originPoint = data.originPoint;

        for (let i = 0; i < coordinates.length; i++) {
            let xWeight = this.currentXWeight(data.xAxisPoints, xAxisPixelWeights, coordinates[i]);
            let yWeight = this.currentYWeight(data.yAxisPoints, yAxisPixelWeights, coordinates[i]);

            const x = (coordinates[i].x - originPoint.xValue) / xWeight + originPoint.xCoordinate;
            const y = (coordinates[i].y - originPoint.yValue) / yWeight + originPoint.yCoordinate;

            result.push({x:x, y:y});
        }

        return result;
    }
}