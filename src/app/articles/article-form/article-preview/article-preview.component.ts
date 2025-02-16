import { Component, Input } from '@angular/core';
import { Article } from '../../../shared/models/article';

@Component({
  selector: 'app-article-preview',
  standalone: true,
  imports: [],
  templateUrl: './article-preview.component.html',
  styleUrl: './article-preview.component.css'
})
export class ArticlePreviewComponent {
  @Input() article!: Omit<Article, 'id_user' | 'id' >;
}
