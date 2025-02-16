import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ArticleCategory, ArticleSearchCategory } from '../../../shared/models/article';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-list-filter.component.html',
  styleUrl: './article-list-filter.component.css',
})
export class ArticleListFilterComponent implements OnInit{
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<ArticleSearchCategory>();

  searchQuery = new FormControl<string>('');
  selectedCategory: string = 'All';

  categories: string[] = [
    'All',
    ArticleCategory.National,
    ArticleCategory.Economy,
    ArticleCategory.Sports,
    ArticleCategory.Technology,
  ];

  ngOnInit() {
    this.searchQuery.valueChanges.subscribe((value) => {
      this.searchChange.emit(value || '');
    });
  }

  // Emit when category is selected
  onCategoryClick(category: string) {
    this.selectedCategory = category;
    this.categoryChange.emit(this.selectedCategory);
  }
}
