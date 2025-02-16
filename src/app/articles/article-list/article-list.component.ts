import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ArticleCategory,
  Article,
  ArticlePreview,
  ArticleSearchCategory,
} from '../../shared/models/article';
import { ArticleListDetailComponent } from './article-list-detail/article-list-detail.component';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NewsService } from '../../shared/services/news.service';
import { ArticleListFilterComponent } from "./article-list-filter/article-list-filter.component";

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ArticleListDetailComponent,
    SpinnerComponent,
    RouterModule,
    NavbarComponent,
    ArticleListFilterComponent
],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
})
export class ArticleListComponent {
  articles$!: Observable<ArticlePreview[]>;
  articles!: ArticlePreview[];

  filteredArticles!: ArticlePreview[]; // To hold the filtered articles

  error: any;
  loading: boolean = true;

  searchQuery: string = '';
  selectedCategory: ArticleSearchCategory = 'All';

  constructor(
    private newsService: NewsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.articles$ = this.newsService.getArticles();
    this.articles$.subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  // Handle the search input from the navbar
  onSearchChange(searchQuery: string) {
    this.searchQuery = searchQuery;
    this.filterArticles();
  }

  // Handle the category change from the navbar
  onCategoryChange(category: ArticleSearchCategory) {
    this.selectedCategory = category;
    this.filterArticles();
  }

  filterArticles() {
    this.filteredArticles = this.articles.filter((article) => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        article.category === this.selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  private removeArticle(article: ArticlePreview) {
    this.newsService.deleteArticle(article.id).subscribe({
      next: () => {
        // Remove the article from the list of articles
        this.articles = this.articles.filter((a) => a.id !== article.id);
        this.filterArticles();
        alert(`Article "${article.title}" removed successfully.`);
      },
      error: (err) => {
        console.error('Error removing article', err);
        alert(`Error: Unable to remove the article "${article.title}".`);
      },
    });
  }

  // Confirm deletion of the article
  onArticleRemoved(article: ArticlePreview) {
    const confirmation = window.confirm(
      `Are you sure you want to remove the article: "${article.title}"?`
    );

    if (confirmation) {
        this.removeArticle(article);
    }
  }
}
