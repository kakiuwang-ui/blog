#!/usr/bin/env node

/**
 * 禁用在线管理接口
 * 移除所有Web管理功能，提高安全性
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AdminDisabler {
  constructor() {
    this.serverDir = path.join(__dirname, '../server');
    this.clientDir = path.join(__dirname, '../client/src');
  }

  async disableAdmin() {
    console.log('🔒 禁用在线管理接口...');

    // 1. 移除服务器端管理路由
    await this.removeServerRoutes();

    // 2. 移除客户端管理组件
    await this.removeClientAdmin();

    // 3. 更新路由配置
    await this.updateRouting();

    // 4. 创建只读API
    await this.createReadOnlyAPI();

    console.log('✅ 在线管理接口已禁用！');
    console.log('🔐 网站现在只支持读取，无法通过Web修改');
    console.log('📝 使用本地脚本管理内容：node scripts/local-manage.js');
  }

  async removeServerRoutes() {
    const routesFile = path.join(this.serverDir, 'src/routes/articles.js');

    try {
      let content = await fs.readFile(routesFile, 'utf-8');

      // 移除危险的路由
      const dangerousRoutes = [
        /router\.post\(['"]\/['"],[\s\S]*?\}\);/g,  // POST
        /router\.put\(['"]\/[^'"]*['"],[\s\S]*?\}\);/g,   // PUT
        /router\.delete\(['"]\/[^'"]*['"],[\s\S]*?\}\);/g // DELETE
      ];

      for (const pattern of dangerousRoutes) {
        content = content.replace(pattern, '// [REMOVED] Dangerous route disabled for security');
      }

      await fs.writeFile(routesFile, content);
      console.log('🚫 服务器写入路由已禁用');
    } catch (error) {
      console.log('⚠️  服务器路由文件未找到，跳过');
    }
  }

  async removeClientAdmin() {
    const adminComponents = [
      path.join(this.clientDir, 'components/ArticleEditor.tsx'),
      path.join(this.clientDir, 'components/SecretAdmin.tsx'),
      path.join(this.clientDir, 'pages/Admin.tsx')
    ];

    for (const component of adminComponents) {
      try {
        await fs.unlink(component);
        console.log(`🗑️  已删除: ${path.basename(component)}`);
      } catch (error) {
        console.log(`⚠️  ${path.basename(component)} 未找到，跳过`);
      }
    }
  }

  async updateRouting() {
    const appFile = path.join(this.clientDir, 'App.tsx');

    try {
      let content = await fs.readFile(appFile, 'utf-8');

      // 移除管理相关的路由和导入
      content = content.replace(/import.*Admin.*from.*;\n/g, '');
      content = content.replace(/<Route.*path.*admin.*\/>/g, '');
      content = content.replace(/<Route.*path.*secret-admin.*\/>/g, '');

      await fs.writeFile(appFile, content);
      console.log('🔄 路由配置已更新');
    } catch (error) {
      console.log('⚠️  路由配置文件未找到');
    }
  }

  async createReadOnlyAPI() {
    const readOnlyServer = `
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.static(path.join(__dirname, '../uploads')));

// 只读API
app.get('/api/articles', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/articles.json'), 'utf-8');
    const articles = JSON.parse(data);

    const { category } = req.query;
    const filteredArticles = category
      ? articles.filter(a => a.category === category)
      : articles;

    res.json({ success: true, data: filteredArticles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to read articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/articles.json'), 'utf-8');
    const articles = JSON.parse(data);
    const article = articles.find(a => a.id === req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to read article' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'read-only' });
});

// 阻止所有写入操作
app.post('*', (req, res) => {
  res.status(403).json({ error: 'Write operations are disabled' });
});

app.put('*', (req, res) => {
  res.status(403).json({ error: 'Write operations are disabled' });
});

app.delete('*', (req, res) => {
  res.status(403).json({ error: 'Write operations are disabled' });
});

app.listen(PORT, () => {
  console.log(\`🔒 只读服务器运行在端口 \${PORT}\`);
  console.log('📖 只支持文章读取，无法修改');
});
`;

    const readOnlyFile = path.join(this.serverDir, 'src/read-only-server.js');
    await fs.writeFile(readOnlyFile, readOnlyServer);

    console.log('📖 只读API服务器已创建');
  }

  async createSecurePackageJson() {
    const secureScripts = {
      "start:readonly": "node src/read-only-server.js",
      "local:manage": "node ../scripts/local-manage.js",
      "local:build": "node ../scripts/static-build.js",
      "local:deploy": "node ../scripts/git-workflow.js deploy"
    };

    const packageFile = path.join(this.serverDir, 'package.json');
    const packageData = JSON.parse(await fs.readFile(packageFile, 'utf-8'));

    packageData.scripts = {
      ...packageData.scripts,
      ...secureScripts
    };

    await fs.writeFile(packageFile, JSON.stringify(packageData, null, 2));
    console.log('📦 安全脚本已添加到package.json');
  }
}

// 运行禁用脚本
const disabler = new AdminDisabler();
disabler.disableAdmin()
  .then(() => disabler.createSecurePackageJson())
  .catch(console.error);