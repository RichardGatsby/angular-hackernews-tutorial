import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NewsListService {

  constructor(private apiService: ApiService) { }

  public async getStoryIds() {
    return await this.apiService.getBestNews();
  }

  public async getStories(storieIds: Array<number>): Promise<Array<any>> {
    const storiesPromise = storieIds.map(id => this.apiService.getItem(id));
    return Promise.all(storiesPromise);
  }
}
