import { Subgraph } from "./subgraph";
import { AxisPoint, Point } from './point';

export class CalculatedGraphModel{
    graphName: string;
    xAxisName: string;
    yAxisName: string;
    originPoint: AxisPoint;
    xAxisPoints: AxisPoint[];
    yAxisPoints: AxisPoint[];
    subgraphs: Subgraph[];  

    public toFixed(fractionDigits?: number) : CalculatedGraphModel
    {
        const calculatedGraph = new CalculatedGraphModel();

        calculatedGraph.graphName = this.graphName;
        calculatedGraph.xAxisName = this.xAxisName;
        calculatedGraph.yAxisName = this.yAxisName;

        calculatedGraph.originPoint = {
            isLogScale : this.originPoint.isLogScale,
            logBase : this.originPoint.logBase,
            xCoordinate : Number(this.originPoint.xCoordinate.toFixed(fractionDigits)),
            xValue : Number(this.originPoint.xValue.toFixed(fractionDigits)),
            yCoordinate : Number(this.originPoint.yCoordinate.toFixed(fractionDigits)),
            yValue : Number(this.originPoint.yValue.toFixed(fractionDigits))
        };

        calculatedGraph.xAxisPoints = this.getFixedXAxisPoints(fractionDigits);   
        calculatedGraph.yAxisPoints = this.getFixedYAxisPoints(fractionDigits);

        calculatedGraph.subgraphs = this.getFixedSubgraphs(fractionDigits);

        return calculatedGraph;
    }

    private getFixedXAxisPoints(fractionDigits?: number): AxisPoint[] {
        const xAxisPoints = Array<AxisPoint>();

        this.xAxisPoints.forEach(x => {
            xAxisPoints.push({
                isLogScale : x.isLogScale,
                logBase : x.logBase,
                xCoordinate : Number(x.xCoordinate.toFixed(fractionDigits)),
                xValue : Number(x.xValue.toFixed(fractionDigits)),
                yCoordinate : Number(x.yCoordinate.toFixed(fractionDigits)),
                yValue : undefined
            });
        });

        return xAxisPoints;
    }

    private getFixedYAxisPoints(fractionDigits?: number): AxisPoint[] {
        const yAxisPoints = Array<AxisPoint>();

        this.yAxisPoints.forEach(y => {
            yAxisPoints.push({
                isLogScale : y.isLogScale,
                logBase : y.logBase,
                xCoordinate : Number(y.xCoordinate.toFixed(fractionDigits)),
                xValue : undefined,
                yCoordinate : Number(y.yCoordinate.toFixed(fractionDigits)),
                yValue : Number(y.yValue.toFixed(fractionDigits))
            });
        });
        
        return yAxisPoints;
    }

    private getFixedSubgraphs(fractionDigits?: number): Subgraph[]
    {
        const subgraphs = Array<Subgraph>();       

        for (let i = 0; i < this.subgraphs.length; i++) {
            const subgraph = new Subgraph();
      
            subgraph.id = this.subgraphs[i].id;
            subgraph.interpolationType = this.subgraphs[i].interpolationType;
            subgraph.name = this.subgraphs[i].name;
            subgraph.knots = this.getFixedPoints(this.subgraphs[i].knots, fractionDigits);
            subgraph.tempCoordinates = this.getFixedPoints(this.subgraphs[i].tempCoordinates, fractionDigits);
            subgraph.coordinates = this.getFixedPoints(this.subgraphs[i].coordinates, fractionDigits);

            subgraphs.push(subgraph);     
        }

        return subgraphs;
    }

    private getFixedPoints(points: Point[], fractionDigits?: number): Point[]
    {
        const result = Array<Point>();

        if(points)
        {
            points.forEach(point => {
                result.push({
                    x : Number(point.x.toFixed(fractionDigits)),
                    y : Number(point.y.toFixed(fractionDigits))
                });
            });
        }
        
        return result;
    }
}