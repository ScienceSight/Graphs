import { Injectable } from '@angular/core'
import { saveAs } from 'file-saver';
import { JsonToGraphModel } from 'src/app/_models/_graph/json-to-graph-model';
import { GraphToJsonModel } from 'src/app/_models/_graph/graph-to-json-model';

@Injectable()
export class JsonFileService {

  constructor() {}

  public saveJsonFromGraphData(data: GraphToJsonModel[], fileName: string) {
      const jsonString = JSON.stringify(data);
      var blob = new Blob([jsonString], {type: "application/json;charset=utf-8"})
      saveAs(blob, fileName);
    }

  public loadGraphDataFromJsonString(data: string) : JsonToGraphModel[] {
      const jsonToGraphModelArray = new Array<JsonToGraphModel>();
      const graphObjectFromJson = JSON.parse(data);

      for (let i = 0; i < graphObjectFromJson.length; i++) {
        const jsonToGraphModel = graphObjectFromJson[i] as JsonToGraphModel;
        jsonToGraphModelArray.push(jsonToGraphModel);        
      }

      return jsonToGraphModelArray;
    }
}