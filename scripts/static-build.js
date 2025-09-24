#!/usr/bin/env node

/**
 * 静态站点生成器
 * 将博客完全静态化，无需后端服务器
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StaticSiteGenerator {
  constructor() {
    this.sourceDir = path.join(__dirname, '../server/data');
    this.outputDir = path.join(__dirname, '../static-dist');
    this.clientDir = path.join(__dirname, '../client');
  }

  async generateStaticSite() {
    console.log('🏗️  开始生成静态站点...');

    // 1. 创建输出目录
    await fs.mkdir(this.outputDir, { recursive: true });

    // 2. 读取文章数据
    const articles = await this.readArticles();

    // 3. 生成API数据文件
    await this.generateApiData(articles);

    // 4. 构建前端
    await this.buildClient();

    // 5. 复制静态资源
    await this.copyStaticAssets();

    console.log('✅ 静态站点生成完成！');
    console.log(`📁 输出目录: ${this.outputDir}`);
    console.log('🚀 可直接部署到任何静态托管服务');
  }

  async readArticles() {
    try {
      const data = await fs.readFile(path.join(this.sourceDir, 'articles.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('❌ 无法读取文章数据');
      return [];
    }
  }

  async generateApiData(articles) {
    const apiDir = path.join(this.outputDir, 'api');
    await fs.mkdir(apiDir, { recursive: true });

    // 生成文章列表API
    await fs.writeFile(
      path.join(apiDir, 'articles.json'),
      JSON.stringify({ success: true, data: articles }, null, 2)
    );

    // 生成各分类API
    const categories = ['blog', 'skills', 'videos', 'music', 'resume'];
    for (const category of categories) {
      const categoryArticles = articles.filter(a => a.category === category);
      await fs.writeFile(
        path.join(apiDir, `articles-${category}.json`),
        JSON.stringify({ success: true, data: categoryArticles }, null, 2)
      );
    }

    // 生成单个文章API
    const articlesDir = path.join(apiDir, 'articles');
    await fs.mkdir(articlesDir, { recursive: true });

    for (const article of articles) {
      await fs.writeFile(
        path.join(articlesDir, `${article.id}.json`),
        JSON.stringify({ success: true, data: article }, null, 2)
      );
    }

    console.log('📄 API数据文件生成完成');
  }

  async buildClient() {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    console.log('🔨 构建前端应用...');

    try {
      // 修改前端配置以使用静态API
      await this.updateClientConfig();

      // 构建前端
      await execAsync('npm run build', { cwd: this.clientDir });

      // 复制构建结果
      const distDir = path.join(this.clientDir, 'dist');
      await this.copyDirectory(distDir, this.outputDir);

      console.log('✅ 前端构建完成');
    } catch (error) {
      console.error('❌ 前端构建失败:', error.message);
    }
  }

  async updateClientConfig() {
    // 创建静态配置覆盖
    const configContent = `
// 静态部署配置
window.STATIC_MODE = true;
window.API_BASE = './api';
`;

    const configFile = path.join(this.clientDir, 'public/static-config.js');
    await fs.writeFile(configFile, configContent);

    // 修改 index.html 引入配置
    const indexPath = path.join(this.clientDir, 'index.html');
    let indexContent = await fs.readFile(indexPath, 'utf-8');

    if (!indexContent.includes('static-config.js')) {
      indexContent = indexContent.replace(
        '</head>',
        '  <script src="/static-config.js"></script>\n</head>'
      );
      await fs.writeFile(indexPath, indexContent);
    }
  }

  async copyStaticAssets() {
    // 复制上传的文件
    const uploadsSource = path.join(__dirname, '../server/uploads');
    const uploadsTarget = path.join(this.outputDir, 'uploads');

    try {
      await this.copyDirectory(uploadsSource, uploadsTarget);
      console.log('📂 静态资源复制完成');
    } catch (error) {
      console.log('⚠️  没有找到uploads目录，跳过资源复制');
    }
  }

  async copyDirectory(source, target) {
    await fs.mkdir(target, { recursive: true });
    const items = await fs.readdir(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  async generateDeploymentFiles() {
    // 生成部署配置文件
    const deployConfigs = {
      // Nginx配置
      'nginx.conf': `
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/blog;
    index index.html;

    # 静态文件缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API文件
    location /api/ {
        add_header Content-Type application/json;
        expires 5m;
    }
}
`,

      // Vercel配置
      'vercel.json': JSON.stringify({
        "rewrites": [
          { "source": "/api/(.*)", "destination": "/api/$1.json" },
          { "source": "/(.*)", "destination": "/index.html" }
        ],
        "headers": [
          {
            "source": "/api/(.*)",
            "headers": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Cache-Control", "value": "max-age=300" }
            ]
          }
        ]
      }, null, 2),

      // Netlify配置
      '_redirects': `
/api/* /api/:splat.json 200
/* /index.html 200
`
    };

    for (const [filename, content] of Object.entries(deployConfigs)) {
      await fs.writeFile(path.join(this.outputDir, filename), content);
    }

    console.log('⚙️  部署配置文件生成完成');
  }
}

// 运行静态站点生成
const generator = new StaticSiteGenerator();
generator.generateStaticSite()
  .then(() => generator.generateDeploymentFiles())
  .catch(console.error);