import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Article, ArticlePreview } from '../models/article';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private newsUrl = 'https://sanger.dia.fi.upm.es/pui-rest-news/articles'; // URL to web api
  private articleUrl = 'https://sanger.dia.fi.upm.es/pui-rest-news/article'; // URL to web api

  private userSubscription: Subscription;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.APIKEY = '';
    this.userSubscription = this.loginService.user$.subscribe((user) => {
      if (user) {
        this.setUserApiKey(user.apikey);
      } else {
        this.setAnonymousApiKey();
      }
    });
  }

  // Set the corresponding APIKEY accordig to the received by email
  private APIKEY: string | null;
  private APIKEY_ANON = 'ANON02';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY_ANON,
    }),
  };

  // Modifies the APIKEY with the received value
  setUserApiKey(apikey: string | undefined) {
    if (apikey) {
      this.APIKEY = apikey;
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY,
      }),
    };
    console.log('Apikey successfully changed ' + this.APIKEY);
  }

  setAnonymousApiKey() {
    this.setUserApiKey(this.APIKEY_ANON);
  }

  // Returns the list of news contain elements with the following fields:
  // {"id":...,
  //  "id_user":...,
  //  "abstract":...,
  //  "subtitle":...,
  //  "update_date":...,
  //  "category":...,
  //  "title":...,
  //  "thumbnail_image":...,
  //  "thumbnail_media_type":...}

  getArticles(): Observable<ArticlePreview[]> {
    return this.http.get<ArticlePreview[]>(this.newsUrl, this.httpOptions);
  }

  deleteArticle(article: Article | number): Observable<Article> {
    const id = (typeof article === 'number' || typeof article === 'string') ? article : article.id;
    const url = `${this.articleUrl}/${id}`;
    return this.http.delete<Article>(url, this.httpOptions);
  }

  // Returns an article which contains the following elements:
  // {"id":...,
  //  "id_user":...,
  //  "abstract":...,
  //  "subtitle":...,
  //  "update_date":...,
  //  "category":...,
  //  "title":...,
  //  "image_data":...,
  //  "image_media_type":...}

  getArticle(id: string | null): Observable<Article> {
    console.log('Requesting article id=' + id);
    const url = `${this.articleUrl}/${id}`;
    return this.http.get<Article>(url, this.httpOptions);
  }

  updateArticle(article: Article): Observable<Article> {
    console.log('Updating article id=' + article.id);
    return this.http.post<Article>(this.articleUrl, article, this.httpOptions);
  }

  createArticle(article: Article): Observable<Article> {
    console.log('Creating article');
    console.log(article);
    return this.http.post<Article>(this.articleUrl, article, this.httpOptions);
  }
}
