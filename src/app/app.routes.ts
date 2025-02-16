import { Routes } from '@angular/router';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleDetailComponent } from './articles/article-detail/article-detail.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleFormComponent } from './articles/article-form/article-form.component';
import { LoginService as LoginGuard } from './shared/services/login.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  {
    path: 'articles',
    component: ArticlesComponent,
    children: [
      {
        path: '',
        component: ArticleListComponent,
      },
      {
        path: 'create',
        component: ArticleFormComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'edit/:articleId',
        component: ArticleFormComponent,
        canActivate: [LoginGuard],
      },
      {
        path: ':articleId',
        component: ArticleDetailComponent,
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent}
];
