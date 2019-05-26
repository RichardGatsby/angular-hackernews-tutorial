# Angular Hacker News Tutorial Application


## Overview

This application takes the developer through the process of building a web-application using
Angular. The application is based on the known good practises used world wide. The application is going to load and show
a list of hacker news. This repository was created to give a first coding experience for a few friends but I desided to share it incase someone else found it usefull!

The full solution can be found and cloned from this repository. The architecture will be mainly explained via
links since angular already provides really detailed documentation.



## Prerequisites

### Code editor
- You can choose your own favourite code editor.
- My favourite code editor at the moment is [vscode][vs-code].

### Git
- Is used as a version controller.
- You can find documentation and download git [here][git-home].

### Node.js and Angular CLI

- Get [Node.js][node].
- After installing node install [Angular CLi][ng-cli]



## Workings of the Application

- The application folder layout is based on the general structure that Angular CLI creates.
- This application will be using hacker news api for fetching the data. This might be a risk for the future
  if the api gets deprecated. I will probably add some static json data to work as a backup later on.
- Future improvements include adding routing and a component to view the comments.



## Lets get started

Start by creating a folder for your project and navigate to that new folder.

```
mkdir Projects
cd Projects
```

Use Angular CLI to generate the starter template.

```
ng new angular-hackernews-tutorial
```

Choose no to adding routing and CSS as stylesheet format. When the project is done being generated lets
test that everything went according to plan by trying to run the application.

```
cd angular-hackernews-tutorial
ng serve
```
Open a browser and navigate to url http://localhost:4200/. If you see a welcoming message everything is up
and running!



## Projects structure

First check the general concepts of [Modules, Components and Services][angular-arch].

Open the generated project in you designated editor.
Lets quickly go trough the most important parts of the project!

```
node_modules/...         --> 3rd party libraries and development tools (fetched using `npm`)

src/                     --> all the source code of the app (along with unit tests)
  app/...                --> the application container folder
  assets/...             --> related assets (images, translations, svgs)
  environments/...       --> environment configs (dev / prod)
  main.ts                --> bootstraps the application
  index.html             --> app layout file (the main HTML template file of the app)
  styles.css             --> global styles for the application

package.json             --> Node.js specific metadata, including development tools dependencies
```



### Installing dependencies

It is important to acknowledge that some of the functionalities your going to need are already available as
a [npm package][npm-package]. So its always usefull to check if you can speed up the development with these packages.

In this project we are going to use [Angular Material][ng-material] to provide styles for the application.

Use the [get started][ng-get-started] to add Angular material to project (Steps 1,2 and 4)



## Creating the service layer

We are going to take the long road here by first generating services that handle getting the hacker news list.
This data is going to be essential for our application to work and in my oppinion is the priority number one.

Create a folder for the services inside app folder and navigate to it

```
mkdir services
cd services
```

Use the angular client to generate the base template for the two services we need: api and news-list service. (oh the life is so easy novadays)

```
ng generate service api
ng generate service news-list

```

The api.service.ts is going to be the interface between our client and the hacker news api we are fetching data from.
The news-list.service.ts  is going to call the api service and handle holding and handling the data.


Lets start with the api.service.ts. We are going to use angulars own HttpClient for making the http requests. For this to
work we have to import the HttpClientModule. 

To import it you need to edit the app.component.ts file

- Add importing statement at the beginning of the file
```
import { HttpClientModule } from '@angular/common/http';
```
- Add it to the imports section of NgModule
```
  imports: [
    BrowserModule,
    HttpClientModule
  ],
```

Now that we have the HttpClientModule imported we can use HttpClient with dependency injection in the api.service.ts

Lets start by importing the http client and injecting it in the constructor:

- Add importing statement at the beginning of the api.service.ts.
```
import { HttpClient } from '@angular/common/http';

```

- Add a reference to it in the constructor
```
 constructor(private readonly http: HttpClient) { }
```

Next we will add a url for the api we are going to call as a readonly variable at the beginning of the class

```
  private readonly baseUrl: string = "https://hacker-news.firebaseio.com/v0";
```

Now we have the base setup so we can actually create our first method that gets the list of the id's of the highest rated news
```
  public getBestNews(): Promise<Array<number>> {
    return this.http.get<Array<number>>(this.baseUrl + "/beststories.json?print=pretty").toPromise()
  }
```

We will also add another method that fetches the news actual data with the id

```
 public async getItem(id: number): Promise<any> {
    return this.http.get<any>(this.baseUrl + "/item/" + id + ".json?print=pretty").toPromise()
  }
```

Our api service is complete for now and next up we are gonna make write the logic for news-list service that transfers the
data to the actually components

We start by importing the ApiService class to news-list.service.ts.

- Add importing statement at the beginning of the api.service.ts.
```
import { ApiService } from './api.service';
```

- Add a reference to it in the constructor
```
constructor(private apiService: ApiService) { }
```

Next up we need to create methods that call the api service methods we created earlier

```
  public async getStoryIds() {
    return await this.apiService.getBestNews();
  }

  public async getStories(storieIds: Array<number>): Promise<Array<any>> {
    const storiesPromise = storieIds.map(id => this.apiService.getItem(id));
    return Promise.all(storiesPromise);
  }
```

Now we have the service layer defined and we can move to the actual components that are visible for the user!



## Creating the components

Create a folder for the components inside app folder and navigate to it

```
mkdir components
cd components
```

Use the angular client to generate the base template for the two components we will be needing

```
ng generate components header
ng generate components news-list
```

Lets start of with the header. Most of the applications you see on the web usually has a header. The header usually contains atleast branding and navigation.


Check the generated header.component.ts file. At the 4th line you should see a selector property with the value 'app-header'. 
This is the selector we can use to import the header to our page which for the sake of simplicity in this application is the
app.component.html file. So lets do this!

- Add the header component to the beginning of app.component.html
```
<app-header></app-header>
```

- We can also remove all the auto generated boilerplate code from the app.component.html

Now if you start up the application and check it from the browser you should see the header component!

Lets use [mat-toolbar][mat-toolbar] inside the header.component.html as a container for the site title by adding the
following line! (note that you must first import the component see instructions from the mat-toolbar link!)

```
<mat-toolbar color="primary">Hacker news</mat-toolbar>
```
Now if you check the application from the browser it should have a toolbar with dark blue background. Our simple yet elegant 
header is now done and we can move to the news list component


- Once again we start by adding the component to our page which is app.component.html. 
```
<app-news-list></app-news-list>
```

Next we need to call the services we created earlier from the component to get the news data!

- First import the NewsListService at the beginning of the file!
```
import { NewsListService } from 'src/app/services/news-list.service';
```
- Add a reference to it in the constructor
```
  constructor(private newsService: NewsListService) { }
```

We can take advantage of the angulars ngOnInit method that always runs when the component is loaded for the first time and handle
the loading of the news in it!

- Add a variable for the news list before the constructor
```
  news: any;
```

- Change the ngOnInit function to async and call the news service inside it
```
  async ngOnInit() {
    const newsIdList = await this.newsService.getStoryIds();
    this.news = await this.newsService.getStories(newsIdList.slice(0, 20));
  }
```

Now that we have the data saved to the news variable lets use [mat-list][mat-list] to show it. (Note that you need to import the mat-list check the link!)

- Add this to the news-list.component.html file
```
<mat-list>
  <mat-list-item  *ngFor="let item of news; let i = index">
    {{i+1}}. 
    <a target='_blank' href="{{item.url}}" style="padding: 0 5px;">{{item.title}}</a>
     by <b style="padding: 0 5px;"> {{item.by}} </b>
     on <i style="padding: 0 5px;"> {{toDate(item.time)}} </i>
  </mat-list-item>
</mat-list>
```

## And volah we are done! 

Future improvements for the application could be:
- adding a paginator / lazy loading for the news (since the app only downloads the first 20 news at the moment)
- adding a second page for showing the comments that news has (with angular routing)
- adding some proper styling
- adding a model for the response item to take full advantage of typescript

I realize i skipped a corner here or there during the guide since the first idea was to
explain things troughout in real life. I will try to update the guide and maybe add new features to the app in the future!

If you liked the guide hit me up with a star :) Feedback is also highly appreciated!



[node]: https://nodejs.org/en/
[git-home]: https://git-scm.com/
[ng-cli]: https://cli.angular.io/
[vs-code]: https://code.visualstudio.com/
[angular-arch]: https://angular.io/guide/architecture
[npm-package]: https://www.npmjs.com/
[ng-material]: https://material.angular.io/
[ng-get-started]: https://material.angular.io/guide/getting-started
[mat-toolbar]: https://material.angular.io/components/toolbar/overview
[mat-list]: https://material.angular.io/components/list/overview
