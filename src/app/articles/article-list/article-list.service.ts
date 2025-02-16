import { Injectable } from '@angular/core';
import { NewsService } from '../../shared/services/news.service';
import {
  ArticlePreview,
  ArticleSearchCategory,
} from '../../shared/models/article';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleListService {
  articles!: ArticlePreview[];

  private filteredArticles: BehaviorSubject<ArticlePreview[]> =
    new BehaviorSubject<ArticlePreview[]>([]);
  filteredArticles$: Observable<ArticlePreview[]> =
    this.filteredArticles.asObservable();

  searchQuery: string = '';
  selectedCategory: ArticleSearchCategory = 'All';

  constructor(private newsService: NewsService) {}

  loadArticles(): Observable<ArticlePreview[]> {
    this.reloadArticles();
    return this.filteredArticles$;
  }

  reloadArticles() {
    this.newsService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles.next(this.articles);
      },
      error: (error) => {
        this.filteredArticles.error(error);
      },
    });
  }

  private filterArticles() {
    this.filteredArticles.next(
      this.articles.filter((article) => {
        const matchesCategory =
          this.selectedCategory === 'All' ||
          article.category === this.selectedCategory;
        const matchesSearch =
          article.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          article.subtitle
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    );
  }



  removeArticle(articleId: number) {
    this.newsService.deleteArticle(articleId).subscribe({
      next: () => {
        // Remove the article from the list of articles
        this.articles = this.articles.filter((a) => a.id !== articleId);
        this.filterArticles();
        // Remove the article from the local array for instant feedback
        // this.filteredArticles = this.filteredArticles.filter(
        //   (a) => a.id !== articleId.id
        // );
        // alert(`Article "${articleId.title}" removed successfully.`);
      },
      error: (err) => {
        console.error('Error removing article', err);
        // alert(`Error: Unable to remove the article "${articleId.title}".`);
      },
    });
  }
}
