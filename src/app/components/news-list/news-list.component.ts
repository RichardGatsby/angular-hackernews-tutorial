import { Component, OnInit } from '@angular/core';
import { NewsListService } from 'src/app/services/news-list.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  news: any;

  constructor(private newsService: NewsListService) { }

  async ngOnInit() {
    const newsIdList = await this.newsService.getStoryIds();
    this.news = await this.newsService.getStories(newsIdList.slice(0, 20));
  }

  public toDate(ms){
    const dateTime = new Date(ms*1000);
    return dateTime.toLocaleDateString();
  }

}
