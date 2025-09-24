#!/usr/bin/env node

/**
 * 本地博客管理工具
 * 完全离线的文章管理，无需暴露管理接口
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../server/data/articles.json');
const UPLOADS_DIR = path.join(__dirname, '../server/uploads');

class LocalBlogManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async main() {
    console.log('\n🏠 本地博客管理工具');
    console.log('====================');
    console.log('1. 📝 创建新文章');
    console.log('2. 📋 查看所有文章');
    console.log('3. ✏️  编辑文章');
    console.log('4. 🗑️  删除文章');
    console.log('5. 📄 导入Markdown文件');
    console.log('6. 📤 导出备份');
    console.log('0. 退出');
    console.log('====================');

    const choice = await this.askQuestion('请选择操作 (0-6): ');

    switch (choice) {
      case '1':
        await this.createArticle();
        break;
      case '2':
        await this.listArticles();
        break;
      case '3':
        await this.editArticle();
        break;
      case '4':
        await this.deleteArticle();
        break;
      case '5':
        await this.importMarkdown();
        break;
      case '6':
        await this.exportBackup();
        break;
      case '0':
        console.log('👋 再见！');
        this.rl.close();
        return;
      default:
        console.log('❌ 无效选择');
    }

    await this.main(); // 循环菜单
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async readArticles() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('📄 创建新的文章数据文件...');
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
  }

  async writeArticles(articles) {
    await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
  }

  async createArticle() {
    console.log('\n📝 创建新文章');
    console.log('=============');

    const title = await this.askQuestion('文章标题: ');
    if (!title.trim()) {
      console.log('❌ 标题不能为空');
      return;
    }

    const category = await this.askQuestion('分类 (blog/skills/videos/music/resume): ');
    const validCategories = ['blog', 'skills', 'videos', 'music', 'resume'];
    if (!validCategories.includes(category)) {
      console.log('❌ 无效分类');
      return;
    }

    const author = await this.askQuestion('作者 [Rusty Raven]: ') || 'Rusty Raven';
    const tagsInput = await this.askQuestion('标签 (用逗号分隔): ');
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    console.log('📝 请输入文章内容 (按 Ctrl+D 结束):');
    const content = await this.readMultilineInput();

    const excerpt = await this.askQuestion('摘要 [自动生成]: ') ||
                   content.substring(0, 200).replace(/[#*`]/g, '') + '...';

    const article = {
      id: uuidv4(),
      title,
      content,
      category,
      tags,
      author,
      excerpt,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const articles = await this.readArticles();
    articles.push(article);
    await this.writeArticles(articles);

    console.log(`✅ 文章创建成功！ID: ${article.id}`);
  }

  async readMultilineInput() {
    return new Promise((resolve) => {
      let content = '';
      process.stdin.setEncoding('utf-8');

      process.stdin.on('data', (chunk) => {
        content += chunk;
      });

      process.stdin.on('end', () => {
        resolve(content.trim());
        process.stdin.removeAllListeners();
        // 重新设置readline
        this.rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
      });
    });
  }

  async listArticles() {
    const articles = await this.readArticles();

    if (articles.length === 0) {
      console.log('📄 暂无文章');
      return;
    }

    console.log('\n📋 文章列表');
    console.log('===========');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. [${article.category}] ${article.title}`);
      console.log(`   ID: ${article.id}`);
      console.log(`   作者: ${article.author} | 创建时间: ${new Date(article.createdAt).toLocaleString()}`);
      console.log(`   标签: ${article.tags.join(', ') || '无'}`);
      console.log('   ---');
    });
  }

  async editArticle() {
    await this.listArticles();
    const articleId = await this.askQuestion('\n请输入要编辑的文章ID: ');

    const articles = await this.readArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex === -1) {
      console.log('❌ 文章未找到');
      return;
    }

    const article = articles[articleIndex];
    console.log(`\n编辑文章: ${article.title}`);

    const newTitle = await this.askQuestion(`标题 [${article.title}]: `) || article.title;
    const newCategory = await this.askQuestion(`分类 [${article.category}]: `) || article.category;
    const newAuthor = await this.askQuestion(`作者 [${article.author}]: `) || article.author;
    const newTagsInput = await this.askQuestion(`标签 [${article.tags.join(', ')}]: `);
    const newTags = newTagsInput ? newTagsInput.split(',').map(t => t.trim()) : article.tags;

    console.log('是否修改内容？(y/n): ');
    const modifyContent = await this.askQuestion('') === 'y';
    let newContent = article.content;

    if (modifyContent) {
      console.log('📝 请输入新的文章内容 (按 Ctrl+D 结束):');
      newContent = await this.readMultilineInput();
    }

    articles[articleIndex] = {
      ...article,
      title: newTitle,
      category: newCategory,
      author: newAuthor,
      tags: newTags,
      content: newContent,
      updatedAt: new Date().toISOString()
    };

    await this.writeArticles(articles);
    console.log('✅ 文章更新成功！');
  }

  async deleteArticle() {
    await this.listArticles();
    const articleId = await this.askQuestion('\n请输入要删除的文章ID: ');

    const articles = await this.readArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex === -1) {
      console.log('❌ 文章未找到');
      return;
    }

    const article = articles[articleIndex];
    const confirm = await this.askQuestion(`确认删除文章 "${article.title}"？(y/n): `);

    if (confirm === 'y') {
      articles.splice(articleIndex, 1);
      await this.writeArticles(articles);
      console.log('✅ 文章删除成功！');
    } else {
      console.log('❌ 取消删除');
    }
  }

  async importMarkdown() {
    const filePath = await this.askQuestion('Markdown文件路径: ');

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const filename = path.basename(filePath, '.md');

      // 简单解析Markdown标题
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : filename;

      const category = await this.askQuestion('分类 (blog/skills/videos/music/resume): ');
      const author = await this.askQuestion('作者 [Rusty Raven]: ') || 'Rusty Raven';
      const tagsInput = await this.askQuestion('标签 (用逗号分隔): ');
      const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

      const article = {
        id: uuidv4(),
        title,
        content,
        category,
        tags,
        author,
        excerpt: content.substring(0, 200).replace(/[#*`]/g, '') + '...',
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const articles = await this.readArticles();
      articles.push(article);
      await this.writeArticles(articles);

      console.log(`✅ Markdown文件导入成功！ID: ${article.id}`);
    } catch (error) {
      console.log(`❌ 导入失败: ${error.message}`);
    }
  }

  async exportBackup() {
    const backupDir = path.join(__dirname, '../backups');
    await fs.mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `blog-backup-${timestamp}.json`);

    const articles = await this.readArticles();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      articles
    };

    await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
    console.log(`✅ 备份创建成功: ${backupFile}`);
  }
}

// 运行管理工具
const manager = new LocalBlogManager();
manager.main().catch(console.error);