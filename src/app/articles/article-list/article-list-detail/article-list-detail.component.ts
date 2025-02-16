import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticlePreview } from '../../../shared/models/article';
import { LoginService } from '../../../shared/services/login.service';

@Component({
  selector: 'app-article-list-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './article-list-detail.component.html',
  styleUrl: './article-list-detail.component.css',
})
export class ArticleListDetailComponent {
  @Input() article!: ArticlePreview;
  @Output() articleRemoved = new EventEmitter<ArticlePreview>();

  private loginService = inject(LoginService);

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  removeArticle($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.articleRemoved.emit(this.article);
  }
}
