import { Component, inject, Input, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../shared/directives/back-button.directive';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { Article, ArticleCategory } from '../../shared/models/article';
import { includes } from 'lodash-es';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../shared/services/news.service';
import { QuillModule } from 'ngx-quill';
import { LoginService } from '../../shared/services/login.service';
import { Router } from '@angular/router';

// interface ArticleForm {
//   abstract: FormControl<string>;
//   subtitle: FormControl<string>;
//   category: FormControl<string>;
//   title: FormControl<string>;
//   image: FormControl<File>;
//   body: FormControl<string>;
// }

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    BackButtonDirective,
    ReactiveFormsModule,
    ArticlePreviewComponent,
    CommonModule,
    QuillModule,
  ],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css',
})
export class ArticleFormComponent implements OnInit {
  @Input() articleId: string | null = null;

  article: Omit<Article, 'id_user' | 'id'> = {
    title: '',
    subtitle: '',
    abstract: '',
    category: ArticleCategory.Undefined,
    body: '',
    update_date: new Date(),
    image_data: '',
    image_media_type: '',
  };

  categories = [
    ArticleCategory.National,
    ArticleCategory.Economy,
    ArticleCategory.Sports,
    ArticleCategory.Technology,
  ];

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Botones de estilo de texto
      [{ header: 1 }, { header: 2 }], // Encabezados
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      [{ script: 'sub' }, { script: 'super' }], // Subíndice y superíndice
      [{ align: [] }], // Alineación
      ['blockquote', 'code-block'], // Bloques de cita y código
      [{ size: [] }], // Tamaño del texto
      [{ color: [] }, { background: [] }], // Color del texto y fondo
      [{ font: [] }], // Tipos de fuente
      [{ indent: '-1' }, { indent: '+1' }], // Sangría
    ],
  };

  // Form definition
  articleForm = new FormGroup({
    title: new FormControl(this.article.title, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    subtitle: new FormControl(this.article.subtitle, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    abstract: new FormControl(this.article.abstract, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<ArticleCategory>(this.article.category, {
      nonNullable: true,
      validators: [Validators.required, this.categoryNotUndefinedValidator],
    }),
    image: new FormControl('', this.articleId ? [] : [Validators.required]),
    image_data: new FormControl(this.article.image_data),
    image_media_type: new FormControl(this.article.image_media_type),
    body: new FormControl(this.article.body),
  });

  constructor(
    private newsService: NewsService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Edit an existing article
    if (this.articleId) {
      this.newsService.getArticle(this.articleId).subscribe({
        next: (data) => {
          console.log(data);
          this.article = {
            ...this.article,
            title: data.title || '',
            subtitle: data.subtitle || '',
            abstract: data.abstract || '',
            category: data.category || ArticleCategory.Undefined,
            body: data.body || '',
            image_data: data.image_data || '',
            image_media_type: data.image_media_type || '',
          };

          this.articleForm.patchValue({
            title: this.article.title,
            subtitle: this.article.subtitle,
            abstract: this.article.abstract,
            category: this.article.category,
            body: this.article.body,
            image_data: this.article.image_data,
            image_media_type: this.article.image_media_type,
          });

          // if the image is already uploaded and the user does not what to changed it we remove the validation
          if (this.article.image_data && this.article.image_media_type) {
            this.articleForm.controls.image.clearValidators();
            this.articleForm.controls.image.updateValueAndValidity();
          } else {
            // if there is no image or we want to change it we set the validators
            this.articleForm.controls.image.setValidators([
              Validators.required,
            ]);
            this.articleForm.controls.image.updateValueAndValidity();
          }
          console.log('article: ', this.article);
        },
        error: (error) => {
          console.error('Error loading article data', error);
        },
      });
    }

    // Update the article object when the form changes
    this.articleForm.valueChanges.subscribe((value) => {
      this.article = {
        ...this.article,
        title: value.title || '',
        subtitle: value.subtitle || '',
        abstract: value.abstract || '',
        category: value.category || ArticleCategory.Undefined,
        body: value.body || '',
        image_data: value.image_data || '',
        image_media_type: value.image_media_type || '',
      };
    });
  }

  // Custom validator to check if category is not 'Undefined'
  categoryNotUndefinedValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (value === ArticleCategory.Undefined) {
      return { categoryInvalid: true };
    }
    return null;
  }

  // Helper function to access form controls easily in template
  get f() {
    return this.articleForm.controls;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  //code to get the URL of the image
  getImageUrl(imageDate: string, imageType: string): string {
    //console.log("Image Data get URL: ", imageDate);
    //console.log("Image Type: ", imageType);
    if (imageDate && imageType) {
      return 'data:' + imageType + ';base64,' + imageDate;
    }
    return '';
  }

  handleError(error: any) {
    if (error.status === 500) {
      console.error('Internal server error (500)', error);
      alert('Body too long.');
    } else if (error.status === 401) {
      console.error('Unauthorized (401)', error);
      alert('You are not authorized to perform this action. Please log in.');
    } else if (error.status === 400) {
      console.error('Bad request (400)', error);
      alert(
        'There was a problem with your submission. Please check your data.'
      );
    } else {
      console.error('Unexpected error', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  // Code from the assignment
  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files.length === 0) {
      this.articleForm.patchValue({
        image_media_type: '',
        image_data: '',
      });
    } else if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const MAX_SIZE = 20971520;
      const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > MAX_SIZE) {
        this.articleForm.controls.image.setErrors({
          imageError: 'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb',
        });
        return false;
      }
      if (!includes(ALLOWED_TYPES, fileInput.target.files[0].type)) {
        this.articleForm.controls.image.setErrors({
          imageError: 'Only Images are allowed ( JPG | PNG )',
        });
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          const imgBase64Path = e.target.result;
          const head = fileInput.target.files[0].type.length + 13;

          this.articleForm.patchValue({
            image_media_type: fileInput.target.files[0].type,
            image_data: e.target.result.substring(head, e.target.result.length),
          });
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }

  onSubmit() {
    if (this.articleForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.articleForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }

    const articleData: Omit<Article, 'id_user' | 'id'> = {
      title: this.articleForm.value.title || '',
      subtitle: this.articleForm.value.subtitle || '',
      abstract: this.articleForm.value.abstract || '',
      category: this.articleForm.value.category || ArticleCategory.Undefined,
      body: this.articleForm.value.body || '',
      image_data: this.article.image_data || '',
      image_media_type: this.article.image_media_type || '',
      update_date: new Date(),
    };

    if (this.articleId) {
      // Add 'id' to the object explicitly
      const updatedArticle: Article = {
        ...articleData,
        id: +this.articleId,
        id_user: this.loginService.getUser()?.user || 0,
      };

      this.newsService.updateArticle(updatedArticle).subscribe({
        next: (response) => {
          console.debug('Article updated successfully', response);
          this.goBack();
        },
        error: (error) => {
          console.error('Error updating article', error);
          this.handleError(error);
        },
      });
    } else {
      const newArticle: Article = {
        ...articleData,
        id_user: this.loginService.getUser()?.user || 0,
      };

      this.newsService.createArticle(newArticle).subscribe({
        next: (response) => {
          console.debug('Article created successfully', response);
          this.goBack();
        },
        error: (error) => {
          console.error('Error creating article', error);
          this.handleError(error);
        },
      });
    }
  }
}
