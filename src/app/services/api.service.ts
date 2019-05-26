import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl: string = "https://hacker-news.firebaseio.com/v0";

  constructor(private readonly http: HttpClient) { }

  public getBestNews(): Promise<Array<number>> {
    return this.http.get<Array<number>>(this.baseUrl + "/beststories.json?print=pretty").toPromise()
  }

  public async getItem(id: number): Promise<any> {
    return this.http.get<any>(this.baseUrl + "/item/" + id + ".json?print=pretty").toPromise()
  }
}
