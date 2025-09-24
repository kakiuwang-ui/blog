export interface Article {
  id: string;
  title: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  images: string[];
  typstDocument?: string;
  typstPdf?: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  excerpt: string;
}

export type ArticleCategory = 'blog' | 'skills' | 'videos' | 'music' | 'resume';

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ImageUpload {
  file: File;
  preview: string;
}

export interface TypstDocument {
  id: string;
  filename: string;
  originalName: string;
  uploadPath: string;
  pdfPath?: string;
  createdAt: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  excerpt: string;
  images?: string[];
  typstDocument?: string;
  typstPdf?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'typst' | 'markdown';
  path: string;
  size: number;
  lastModified: string;
  content?: string;
}