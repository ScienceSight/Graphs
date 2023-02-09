import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private configuration = {};
    
    constructor(private httpClient: HttpClient) { }
  
    async loadAppConfig() {
        const data = await this.httpClient.get('/assets/config.json')
            .toPromise();
        this.configuration = data;
    }
  
    getValue(key: string, defaultValue?: any): any {
      return this.configuration[key] || defaultValue;
    }
}

