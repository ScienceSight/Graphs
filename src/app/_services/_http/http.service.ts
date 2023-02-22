import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { CalculatedGraphModel } from 'src/app/_models/_graph/calculated-graph-model';

@Injectable()
export class HttpService {
  
  constructor(private http: HttpClient) { }

  public getFile(url: string) {
    return this.http.get(url, {responseType: 'blob'});
  }

  public postGraphData(url: string, data: CalculatedGraphModel) {
    return this.http.post(url, data);
  }
}