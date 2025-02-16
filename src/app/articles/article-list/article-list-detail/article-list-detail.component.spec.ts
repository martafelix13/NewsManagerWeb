import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleListDetailComponent } from './article-list-detail.component';

describe('ArticleListDetailComponent', () => {
  let component: ArticleListDetailComponent;
  let fixture: ComponentFixture<ArticleListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleListDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
