import { Injectable } from '@angular/core'
import { saveAs } from 'file-saver';
import { JsonToGraphModel } from 'src/app/_models/_graph/json-to-graph-model';
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model';

@Injectable()
export class JsonFileService {
  
  constructor() { }
  
  public saveJsonFromGraphData(data: CalculatedGraphModel, fileName: string) {
    const jsonString = JSON.stringify(data);
    var blob = new Blob([jsonString], {type: "application/json;charset=utf-8"})
    saveAs(blob, fileName);
  }

  public loadGraphDataFromJsonString(data: string) : JsonToGraphModel {
    const graphObjectFromJson = JSON.parse(data);
    return graphObjectFromJson as JsonToGraphModel;
  }
}