import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleListFilterComponent } from './article-list-filter.component';

describe('ArticleListFilterComponent', () => {
  let component: ArticleListFilterComponent;
  let fixture: ComponentFixture<ArticleListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleListFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
