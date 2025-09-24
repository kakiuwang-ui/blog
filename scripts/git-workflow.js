#!/usr/bin/env node

/**
 * Git工作流博客管理
 * 通过Git进行版本控制的本地管理方案
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

class GitWorkflowManager {
  constructor() {
    this.postsDir = path.join(__dirname, '../content/posts');
    this.dataDir = path.join(__dirname, '../server/data');
  }

  async init() {
    console.log('🔧 初始化Git工作流...');

    // 创建内容目录结构
    await fs.mkdir(this.postsDir, { recursive: true });
    await fs.mkdir(path.join(this.postsDir, 'blog'), { recursive: true });
    await fs.mkdir(path.join(this.postsDir, 'skills'), { recursive: true });
    await fs.mkdir(path.join(this.postsDir, 'videos'), { recursive: true });
    await fs.mkdir(path.join(this.postsDir, 'music'), { recursive: true });
    await fs.mkdir(path.join(this.postsDir, 'resume'), { recursive: true });

    // 创建示例文章模板
    await this.createTemplate();

    // 创建Git钩子
    await this.setupGitHooks();

    console.log('✅ Git工作流初始化完成！');
    console.log('📁 文章目录: content/posts/');
    console.log('🔄 使用 git add, git commit 管理文章');
  }

  async createTemplate() {
    const template = `---
title: "文章标题"
date: ${new Date().toISOString()}
category: blog
tags: ["标签1", "标签2"]
author: "Rusty Raven"
excerpt: "文章摘要"
draft: false
---

# 文章标题

这里是文章内容...

## 二级标题

- 列表项1
- 列表项2

\`\`\`javascript
// 代码示例
console.log('Hello World!');
\`\`\`
`;

    const templatePath = path.join(this.postsDir, '_template.md');
    await fs.writeFile(templatePath, template);

    console.log('📄 模板文件已创建: content/posts/_template.md');
  }

  async setupGitHooks() {
    const hookContent = `#!/bin/sh
# 自动同步Markdown文件到JSON数据库

echo "🔄 同步文章数据..."
node scripts/sync-content.js

# 添加生成的JSON文件到提交
git add server/data/articles.json

echo "✅ 文章数据同步完成"
`;

    const hookPath = path.join(__dirname, '../.git/hooks/pre-commit');
    await fs.writeFile(hookPath, hookContent);
    await fs.chmod(hookPath, '755');

    console.log('🪝 Git钩子已设置');
  }

  async syncContent() {
    console.log('🔄 同步Markdown内容到数据库...');

    const articles = [];
    const categories = ['blog', 'skills', 'videos', 'music', 'resume'];

    for (const category of categories) {
      const categoryDir = path.join(this.postsDir, category);

      try {
        const files = await fs.readdir(categoryDir);
        const markdownFiles = files.filter(f => f.endsWith('.md'));

        for (const file of markdownFiles) {
          const filePath = path.join(categoryDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const article = this.parseMarkdown(content, category, file);

          if (article && !article.draft) {
            articles.push(article);
          }
        }
      } catch (error) {
        // 目录不存在，跳过
      }
    }

    // 按创建时间排序
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 写入JSON数据库
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.writeFile(
      path.join(this.dataDir, 'articles.json'),
      JSON.stringify(articles, null, 2)
    );

    console.log(`✅ 同步完成，共处理 ${articles.length} 篇文章`);
  }

  parseMarkdown(content, category, filename) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      console.warn(`⚠️  ${filename} 缺少frontmatter`);
      return null;
    }

    const [, frontmatter, body] = frontmatterMatch;
    const meta = this.parseFrontmatter(frontmatter);

    // 生成ID（基于文件名）
    const id = path.basename(filename, '.md').replace(/[^a-zA-Z0-9-]/g, '-');

    return {
      id,
      title: meta.title || filename,
      content: body.trim(),
      category,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      author: meta.author || 'Rusty Raven',
      excerpt: meta.excerpt || body.substring(0, 200) + '...',
      images: meta.images || [],
      typstDocument: meta.typstDocument,
      typstPdf: meta.typstPdf,
      createdAt: meta.date || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draft: meta.draft || false
    };
  }

  parseFrontmatter(frontmatter) {
    const meta = {};
    const lines = frontmatter.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;

        // 解析不同类型的值
        if (value.startsWith('[') && value.endsWith(']')) {
          // 数组
          meta[key] = JSON.parse(value);
        } else if (value === 'true' || value === 'false') {
          // 布尔值
          meta[key] = value === 'true';
        } else if (value.startsWith('"') && value.endsWith('"')) {
          // 字符串
          meta[key] = value.slice(1, -1);
        } else {
          // 原始值
          meta[key] = value;
        }
      }
    }

    return meta;
  }

  async newPost(category = 'blog') {
    const title = process.argv[3] || `New ${category} post`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${new Date().toISOString().split('T')[0]}-${slug}.md`;

    const frontmatter = `---
title: "${title}"
date: ${new Date().toISOString()}
category: ${category}
tags: []
author: "Rusty Raven"
excerpt: ""
draft: true
---

# ${title}

开始写作...
`;

    const filepath = path.join(this.postsDir, category, filename);
    await fs.writeFile(filepath, frontmatter);

    console.log(`📝 新文章创建: ${filepath}`);
    console.log('✏️  编辑完成后运行: git add . && git commit -m "Add new post"');
  }

  async deploy() {
    console.log('🚀 开始部署...');

    try {
      // 同步内容
      await this.syncContent();

      // 构建静态站点
      await execAsync('node scripts/static-build.js');

      // Git操作
      await execAsync('git add .');
      await execAsync('git commit -m "Auto deploy: $(date)"');

      console.log('✅ 部署完成！');
    } catch (error) {
      console.error('❌ 部署失败:', error.message);
    }
  }
}

// 命令行接口
const command = process.argv[2];
const manager = new GitWorkflowManager();

switch (command) {
  case 'init':
    manager.init().catch(console.error);
    break;
  case 'sync':
    manager.syncContent().catch(console.error);
    break;
  case 'new':
    manager.newPost(process.argv[3]).catch(console.error);
    break;
  case 'deploy':
    manager.deploy().catch(console.error);
    break;
  default:
    console.log('🔧 Git工作流博客管理');
    console.log('用法:');
    console.log('  node scripts/git-workflow.js init     # 初始化');
    console.log('  node scripts/git-workflow.js sync     # 同步内容');
    console.log('  node scripts/git-workflow.js new blog # 新建文章');
    console.log('  node scripts/git-workflow.js deploy   # 部署');
}