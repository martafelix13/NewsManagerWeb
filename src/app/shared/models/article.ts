interface ArticleBase {
  id?: number;
  id_user: number;
  abstract: string;
  subtitle: string;
  update_date: Date;
  category: ArticleCategory ;
  title: string;
  username?: string;
}

export enum ArticleCategory {
  Undefined = '',
  National = 'National',
  Economy = 'Economy',
  Sports = 'Sports',
  Technology = 'Technology'
}

export type ArticleSearchCategory = 'All' | Omit<ArticleCategory, ArticleCategory.Undefined>;

// {"id":...,
//  "id_user":...,
//  "abstract":...,
//  "subtitle":...,
//  "update_date":...,
//  "category":...,
//  "title":...,
//  "thumbnail_image":...,
//  "thumbnail_media_type":...}

export interface ArticlePreview extends ArticleBase {
  id: number;
  thumbnail_image: string;
  thumbnail_media_type: string;
}

// {"id":...,
//  "id_user":...,
//  "abstract":...,
//  "subtitle":...,
//  "update_date":...,
//  "category":...,
//  "title":...,
//  "image_data":...,
//  "image_media_type":...}

export interface Article extends ArticleBase {
  image_data: string;
  image_media_type: string;
  body: string;
}






