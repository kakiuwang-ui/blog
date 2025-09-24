import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import type { Article, CreateArticleData, ApiResponse, ArticleCategory } from '../../shared/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data/articles.json');

export class ArticleService {
  private async ensureDataFile(): Promise<void> {
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  private async readArticles(): Promise<Article[]> {
    await this.ensureDataFile();
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading articles file:', error);
      return [];
    }
  }

  private async writeArticles(articles: Article[]): Promise<void> {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
    } catch (error) {
      console.error('Error writing articles file:', error);
      throw error;
    }
  }

  async getAllArticles(): Promise<ApiResponse<Article[]>> {
    try {
      const articles = await this.readArticles();
      return { success: true, data: articles };
    } catch (error) {
      console.error('Error reading articles:', error);
      return { success: false, error: 'Failed to read articles' };
    }
  }

  async getArticlesByCategory(category: ArticleCategory): Promise<ApiResponse<Article[]>> {
    try {
      const articles = await this.readArticles();
      const filtered = articles.filter(article => article.category === category);
      return { success: true, data: filtered };
    } catch (error) {
      console.error('Error filtering articles:', error);
      return { success: false, error: 'Failed to filter articles' };
    }
  }

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    try {
      const articles = await this.readArticles();
      const article = articles.find(a => a.id === id);
      if (!article) {
        return { success: false, error: 'Article not found' };
      }
      return { success: true, data: article };
    } catch (error) {
      console.error('Error finding article:', error);
      return { success: false, error: 'Failed to find article' };
    }
  }

  async createArticle(data: CreateArticleData): Promise<ApiResponse<Article>> {
    try {
      const articles = await this.readArticles();
      const now = new Date().toISOString();

      const newArticle: Article = {
        id: uuidv4(),
        ...data,
        images: data.images || [],
        createdAt: now,
        updatedAt: now
      };

      articles.push(newArticle);
      await this.writeArticles(articles);

      console.log('✅ Article created:', newArticle.title);
      return { success: true, data: newArticle };
    } catch (error) {
      console.error('Error creating article:', error);
      return { success: false, error: 'Failed to create article' };
    }
  }

  async updateArticle(id: string, data: Partial<CreateArticleData>): Promise<ApiResponse<Article>> {
    try {
      const articles = await this.readArticles();
      const index = articles.findIndex(a => a.id === id);

      if (index === -1) {
        return { success: false, error: 'Article not found' };
      }

      const updatedArticle: Article = {
        ...articles[index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      articles[index] = updatedArticle;
      await this.writeArticles(articles);

      console.log('✅ Article updated:', updatedArticle.title);
      return { success: true, data: updatedArticle };
    } catch (error) {
      console.error('Error updating article:', error);
      return { success: false, error: 'Failed to update article' };
    }
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    try {
      const articles = await this.readArticles();
      const index = articles.findIndex(a => a.id === id);

      if (index === -1) {
        return { success: false, error: 'Article not found' };
      }

      const deletedArticle = articles[index];
      articles.splice(index, 1);
      await this.writeArticles(articles);

      console.log('✅ Article deleted:', deletedArticle.title);
      return { success: true };
    } catch (error) {
      console.error('Error deleting article:', error);
      return { success: false, error: 'Failed to delete article' };
    }
  }
}