import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { BackButtonDirective } from '../../shared/directives/back-button.directive';
import { Article } from '../../shared/models/article';
import { NewsService } from '../../shared/services/news.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [SpinnerComponent, BackButtonDirective],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent {
  @Input() articleId!: string;

  article$!: Observable<Article>;
  article!: Article;

  error: any;
  loading: boolean = true;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.article$ = this.newsService.getArticle(this.articleId);
    this.article$.subscribe({
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
      next: (data) => {
        this.article = data;
        this.loading = false;
      },
    });
  }
}
