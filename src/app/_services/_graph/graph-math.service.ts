import { Injectable } from '@angular/core'
import { Subgraph, Graph } from '../../_models/_graph'
import { Point, AxisPoint } from 'src/app/_models/_graph/point'
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model'
import { JsonToGraphModel } from 'src/app/_models/_graph/json-to-graph-model';
import { XAxisPoint } from 'src/app/_models/_graph/x-axis-point';

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
                    data.subgraphs[i].coordinates, 
                    data.originPoint,
                    calculatedGraph.xAxisPoints,
                    calculatedGraph.yAxisPoints);
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
        }

        return calculatedGraph;
    }

    private setXAxisPoints(data: Graph): AxisPoint[] {
        const xAxisPoints = Array<AxisPoint>();

        data.xAxisPoints.forEach(x => {
            xAxisPoints.push(x);
        });

        xAxisPoints.sort((a,b)=>a.xCoordinate - b.xCoordinate);

        return xAxisPoints;
    }

    private setYAxisPoints(data: Graph): AxisPoint[] {
        const yAxisPoints = Array<AxisPoint>();

        data.yAxisPoints.forEach(y => {
            yAxisPoints.push(y);
        });

        yAxisPoints.sort((a,b)=>a.yCoordinate - b.yCoordinate);

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
        coordinates: Point[],
        originPoint: AxisPoint,
        xAxisPointsSorted: AxisPoint[], 
        yAxisPointsSorted: AxisPoint[]) : Point[] 
    {
        const result = Array<Point>();

        for (let i = 0; i < coordinates.length; i++) {
            const xAxisIndex = this.currentXAxisIndex(xAxisPointsSorted, coordinates[i]);
            const yAxisIndex = this.currentYAxisIndex(yAxisPointsSorted, coordinates[i]);

            let x = 0;
            let y = 0;

            if(xAxisIndex==0)
            {
                if(xAxisPointsSorted[xAxisIndex].isLogScale 
                    && xAxisPointsSorted[xAxisIndex].logBase)
                {
                    x = this.calculateXCoordinateOnLogScale(
                        coordinates[i].x,
                        originPoint,
                        xAxisPointsSorted[xAxisIndex]);
                }
                else
                {
                    x = this.calculateXCoordinateOnLinearScale(
                        coordinates[i].x,
                        originPoint,
                        xAxisPointsSorted[xAxisIndex]);
                }
            }
            else
            {
                if(xAxisPointsSorted[xAxisIndex].isLogScale 
                    && xAxisPointsSorted[xAxisIndex].logBase)
                {
                    x = this.calculateXCoordinateOnLogScale(
                        coordinates[i].x,
                        xAxisPointsSorted[xAxisIndex-1],
                        xAxisPointsSorted[xAxisIndex]);
                }
                else
                {
                    x = this.calculateXCoordinateOnLinearScale(
                        coordinates[i].x,
                        xAxisPointsSorted[xAxisIndex-1],
                        xAxisPointsSorted[xAxisIndex]);
                }
            }

            if(yAxisIndex==0)
            {
                if(yAxisPointsSorted[yAxisIndex].isLogScale 
                    && yAxisPointsSorted[yAxisIndex].logBase)
                {
                    y = this.calculateYCoordinateOnLogScale(
                        coordinates[i].y,
                        originPoint,
                        yAxisPointsSorted[yAxisIndex]);
                }
                else
                {
                    y = this.calculateYCoordinateOnLinearScale(
                        coordinates[i].y,
                        originPoint,
                        yAxisPointsSorted[yAxisIndex]);
                }
            }
            else
            {
                if(yAxisPointsSorted[yAxisIndex].isLogScale 
                    && yAxisPointsSorted[yAxisIndex].logBase)
                {
                    y = this.calculateYCoordinateOnLogScale(
                        coordinates[i].y,
                        yAxisPointsSorted[yAxisIndex-1],
                        yAxisPointsSorted[yAxisIndex]);
                }
                else
                {
                    y = this.calculateYCoordinateOnLinearScale(
                        coordinates[i].y,
                        yAxisPointsSorted[yAxisIndex-1],
                        yAxisPointsSorted[yAxisIndex]);
                }
            }

            result.push({x:x, y:y});
        }

        return result;
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

    calculateXCoordinateOnLogScale(tempXCoordinate: number, startScalePoint: AxisPoint, endScalePoint: AxisPoint): number {
        return startScalePoint.xValue * Math.pow(
            endScalePoint.xValue / startScalePoint.xValue, 
            (tempXCoordinate - startScalePoint.xCoordinate) / (endScalePoint.xCoordinate - startScalePoint.xCoordinate)) 
    }

    calculateXCoordinateOnLinearScale(tempXCoordinate: number, startScalePoint: AxisPoint, endScalePoint: AxisPoint): number {
        return startScalePoint.xValue +
            (endScalePoint.xValue - startScalePoint.xValue) / (endScalePoint.xCoordinate - startScalePoint.xCoordinate) *
            (tempXCoordinate - startScalePoint.xCoordinate)
    }

    calculateYCoordinateOnLogScale(tempYCoordinate: number, startScalePoint: AxisPoint, endScalePoint: AxisPoint): number {
        return startScalePoint.yValue * Math.pow(
            endScalePoint.yValue / startScalePoint.yValue, 
            (tempYCoordinate - startScalePoint.yCoordinate) / (endScalePoint.yCoordinate - startScalePoint.yCoordinate)) 
    }

    calculateYCoordinateOnLinearScale(tempYCoordinate: number, startScalePoint: AxisPoint, endScalePoint: AxisPoint): number {
        return startScalePoint.yValue +
            (endScalePoint.yValue - startScalePoint.yValue) / (endScalePoint.yCoordinate - startScalePoint.yCoordinate) *
            (tempYCoordinate - startScalePoint.yCoordinate)
    }
}