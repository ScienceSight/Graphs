import { Injectable } from '@angular/core'
import { saveAs } from 'file-saver';
import { GraphToCsvModel } from 'src/app/_models/_graph/graph-to-csv-model'
import { CsvToGraphModel } from 'src/app/_models/_graph/csv-to-graph-model';
import { AxisPoint } from 'src/app/_models/_graph/point';
import { Point } from 'src/function-curve-editor';
import { InterpolationType } from 'src/app/_models/_graph/interpolation-type';

@Injectable()
export class CsvFileService {

  constructor() {}

  public saveCsvFromGraphData(data: GraphToCsvModel[], fileName: string) {
      const replacer = (key, value) => value === null ? '' : value;
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
      var blob = new Blob([csvArray], {type: "text/csv;charset=utf-8"})
      saveAs(blob, fileName);
    }

  public loadGraphDataFromCsvString(data: string) : CsvToGraphModel[] {
      const csvToGraphModelArray = new Array<CsvToGraphModel>();
      const csvRecordsArray = (<string>data).split(/\r\n|\n/);        

      for (let i = 1; i < csvRecordsArray.length; i++) {
        const csvToGraphModel = this.parseCsvRowToGraphModel(csvRecordsArray[i]);
        csvToGraphModelArray.push(csvToGraphModel);        
      }

      return csvToGraphModelArray;
    }

  private parseCsvRowToGraphModel(csvRow: string) : CsvToGraphModel {
      const results = this.parseCsvRow(csvRow);

      return this.mapToGraphModel(results);
    }

  private mapToGraphModel(results: string[]): CsvToGraphModel {
      const csvToGraphModel = new CsvToGraphModel();

      //originPoint,subgraphCoordinates,subgraphId,subgraphInterpolationType,subgraphKnots,subgraphName,xAxisName,xAxisPoint,yAxisName,yAxisPoint

      csvToGraphModel.originPoint = results[0] as any as AxisPoint;
      csvToGraphModel.subgraphCoordinates = results[1] as any as Point[];
      csvToGraphModel.subgraphId = results[2] as any as number;
      csvToGraphModel.subgraphInterpolationType = results[3] as InterpolationType;
      csvToGraphModel.subgraphKnots = results[4] as any as Point[];
      csvToGraphModel.subgraphName = results[5];
      csvToGraphModel.xAxisName = results[6];
      csvToGraphModel.xAxisPoint = results[7] as any as AxisPoint;
      csvToGraphModel.yAxisName = results[8];
      csvToGraphModel.yAxisPoint = results[9] as any as AxisPoint;
      

      return csvToGraphModel;
    }

  private parseCsvRow(csvRow: string) : string[] {
      const results = [];
      let line = "";
      let previousElement = "";

      for (let i = 0; i < csvRow.length; i++)
      {
          if (line.includes('[') || csvRow[i] == '[')
          {
              line += csvRow[i];
              if(csvRow[i] == ']')
              {
                  results.push(line);
                  line = "";
              }
              continue;
          }

          if (line.includes('{') || csvRow[i] == '{')
          {
              line += csvRow[i];
              if (csvRow[i] == '}')
              {
                  results.push(line);
                  line = "";
              }
              continue;
          }

          if (line.includes('"') || csvRow[i] == '"' && csvRow[i] != ',')
          {
              line += csvRow[i];
              if (line.search(/".*"/) != -1)
              {
                  results.push(line);
                  line = "";
              }
              continue;
          }

          if(i == 0 || i == csvRow.length - 1)
          {
              if(csvRow[i] == ',')
              {
                  results.push(undefined);
              }
          }

          if(i > 0)
          {
              previousElement = csvRow[i - 1];

              if(previousElement == ',' && csvRow[i] == ',')
              {
                  results.push(undefined);
                  continue;
              }

              if (csvRow[i] != ',')
              {
                  line += csvRow[i];
              }
              else if(line.length > 0 && csvRow[i] == ',')
              {
                  results.push(line);
                  line = "";
              }
              continue;
          }
      }

      return results;
    }
}