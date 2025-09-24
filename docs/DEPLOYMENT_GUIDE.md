# 🚀 部署指南

## 概览

本文档详细介绍了博客系统的部署方案，包括开发环境、测试环境和生产环境的配置和部署流程。

## 📋 部署前准备

### 系统要求

#### 最低系统要求
- **操作系统**: Linux (Ubuntu 20.04+), macOS (10.15+), Windows 10+
- **CPU**: 2 核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **网络**: 稳定的互联网连接

#### 推荐系统配置
- **操作系统**: Ubuntu 22.04 LTS / CentOS 8+
- **CPU**: 4 核心
- **内存**: 8GB RAM
- **存储**: 50GB SSD
- **网络**: 100Mbps+ 带宽

### 依赖软件安装

#### 1. Node.js 安装
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs npm

# macOS (使用 Homebrew)
brew install node

# 验证安装
node --version  # 应显示 v18.0.0+
npm --version   # 应显示 9.0.0+
```

#### 2. Typst 编译器安装
```bash
# Ubuntu/Debian
wget https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz
tar -xf typst-x86_64-unknown-linux-musl.tar.xz
sudo mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

# CentOS/RHEL
curl -L https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz | tar -xJ
sudo mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

# macOS
brew install typst

# 验证安装
typst --version  # 应显示 typst 0.11.0+
```

#### 3. Git 安装
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo dnf install git

# macOS
brew install git
```

#### 4. 进程管理器 PM2 (生产环境推荐)
```bash
npm install -g pm2
```

## 🔧 开发环境部署

### 1. 获取项目代码
```bash
# 克隆项目
git clone <your-repository-url>
cd blog

# 或者直接使用现有项目
cd /Users/wangjiaqiao/Desktop/blog
```

### 2. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd client && npm install && cd ..

# 安装后端依赖
cd server && npm install && cd ..
```

### 3. 环境配置
```bash
# 创建环境配置文件
cp .env.example .env

# 编辑配置文件
vim .env
```

**.env 配置示例**:
```env
# 服务器配置
NODE_ENV=development
PORT=5001
CLIENT_PORT=3001

# 文件路径配置
DOCUMENTS_DIR=./server/documents
UPLOADS_DIR=./server/uploads
COMPILED_DIR=./server/compiled

# Typst 配置
TYPST_TIMEOUT=30000
TYPST_MAX_FILE_SIZE=10485760

# 调试配置
DEBUG=true
LOG_LEVEL=debug
```

### 4. 启动开发服务
```bash
# 启动完整开发环境
npm run dev

# 或者分别启动
npm run dev:client  # 前端开发服务器
npm run dev:server  # 后端开发服务器
```

### 5. 验证安装
访问以下地址验证服务正常运行：
- 前端: http://localhost:3001
- 后端 API: http://localhost:5001/api/health

## 🏭 生产环境部署

### 方案一：传统服务器部署

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y nginx certbot python3-certbot-nginx

# 创建应用用户
sudo useradd -m -s /bin/bash bloguser
sudo usermod -aG sudo bloguser
```

#### 2. 项目部署
```bash
# 切换到应用用户
sudo su - bloguser

# 克隆项目到生产目录
git clone <your-repository-url> /home/bloguser/blog
cd /home/bloguser/blog

# 安装依赖
npm install --production

# 构建前端
npm run build
```

#### 3. 生产环境配置
```bash
# 创建生产环境配置
cat > .env.production << EOF
NODE_ENV=production
PORT=5001
CLIENT_PORT=3001

# 文件路径
DOCUMENTS_DIR=./server/documents
UPLOADS_DIR=./server/uploads
COMPILED_DIR=./server/compiled

# 安全配置
CORS_ORIGIN=https://yourdomain.com
SESSION_SECRET=$(openssl rand -base64 32)

# 日志配置
LOG_LEVEL=info
LOG_FILE=./logs/app.log
EOF
```

#### 4. Nginx 配置
```bash
# 创建 Nginx 配置文件
sudo tee /etc/nginx/sites-available/blog << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 静态文件
    location / {
        root /home/bloguser/blog/client/dist;
        try_files \$uri \$uri/ /index.html;

        # 缓存配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # 上传文件
    location /uploads/ {
        alias /home/bloguser/blog/server/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # 文件大小限制
    client_max_body_size 10M;
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL 证书配置
```bash
# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 6. PM2 进程管理
```bash
# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'blog-server',
    script: './server/dist/index.js',
    cwd: '/home/bloguser/blog',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    ignore_watch: ["node_modules", "logs", "server/compiled"],
    restart_delay: 4000,
    max_restarts: 5,
    min_uptime: '10s'
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 方案二：Docker 容器部署

#### 1. Dockerfile
```dockerfile
# 多阶段构建 Dockerfile
FROM node:18-alpine AS builder

# 安装 Typst
RUN apk add --no-cache curl tar xz
RUN curl -L https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz | tar -xJ -C /tmp
RUN mv /tmp/typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建前端
COPY client/ ./client/
WORKDIR /app/client
RUN npm ci && npm run build

# 生产镜像
FROM node:18-alpine AS runtime

# 安装 Typst
RUN apk add --no-cache curl tar xz
RUN curl -L https://github.com/typst/typst/releases/latest/download/typst-x86_64-unknown-linux-musl.tar.xz | tar -xJ -C /tmp
RUN mv /tmp/typst-x86_64-unknown-linux-musl/typst /usr/local/bin/

# 创建应用用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bloguser -u 1001

WORKDIR /app

# 复制依赖和代码
COPY --from=builder --chown=bloguser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=bloguser:nodejs /app/client/dist ./client/dist
COPY --chown=bloguser:nodejs server/ ./server/
COPY --chown=bloguser:nodejs shared/ ./shared/
COPY --chown=bloguser:nodejs package.json ./

# 创建必要目录
RUN mkdir -p logs uploads documents compiled && chown -R bloguser:nodejs .

USER bloguser

EXPOSE 5001

CMD ["npm", "start"]
```

#### 2. docker-compose.yml
```yaml
version: '3.8'

services:
  blog:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
    volumes:
      - ./server/documents:/app/server/documents
      - ./server/uploads:/app/server/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - blog
    restart: unless-stopped
```

#### 3. 部署命令
```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 更新部署
docker-compose pull && docker-compose up -d
```

## 🔄 CI/CD 自动化部署

### GitHub Actions 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /home/bloguser/blog
          git pull origin main
          npm ci --production
          npm run build
          pm2 reload blog-server
```

## 📊 监控和维护

### 1. 系统监控
```bash
# 安装监控工具
npm install -g @pm2/monitor

# 配置系统监控
pm2 install pm2-server-monit

# 查看实时状态
pm2 monit
```

### 2. 日志管理
```bash
# 查看应用日志
pm2 logs blog-server

# 日志轮转配置
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 3. 性能优化
```bash
# 启用 gzip 压缩
sudo vim /etc/nginx/nginx.conf
# 添加以下配置到 http 块：
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# 启用 HTTP/2
# 在 server 块中使用 listen 443 ssl http2;
```

### 4. 备份策略
```bash
# 创建备份脚本
cat > /home/bloguser/backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/bloguser/backups"

mkdir -p $BACKUP_DIR

# 备份应用数据
tar -czf $BACKUP_DIR/blog_data_$DATE.tar.gz \
    /home/bloguser/blog/server/data \
    /home/bloguser/blog/server/documents \
    /home/bloguser/blog/server/uploads

# 清理旧备份（保留最近7天）
find $BACKUP_DIR -name "blog_data_*.tar.gz" -mtime +7 -delete

echo "Backup completed: blog_data_$DATE.tar.gz"
EOF

chmod +x /home/bloguser/backup.sh

# 设置定时备份
crontab -e
# 添加：0 2 * * * /home/bloguser/backup.sh
```

## 🔒 安全配置

### 1. 防火墙配置
```bash
# Ubuntu UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# CentOS/RHEL Firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 安全更新
```bash
# 启用自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. 应用安全
```bash
# 设置文件权限
chmod 755 /home/bloguser/blog
chmod -R 644 /home/bloguser/blog/server/documents
chmod -R 755 /home/bloguser/blog/server/uploads
chmod 600 /home/bloguser/blog/.env.production
```

## 🚨 故障排除

### 常见问题及解决方案

#### 1. 端口占用
```bash
# 检查端口占用
sudo lsof -i :5001
sudo netstat -tulpn | grep :5001

# 终止占用进程
sudo kill -9 <PID>
```

#### 2. Typst 编译失败
```bash
# 检查 Typst 安装
typst --version

# 检查文件权限
ls -la /home/bloguser/blog/server/documents/

# 手动测试编译
typst compile test.typ test.pdf
```

#### 3. Nginx 配置错误
```bash
# 测试配置文件
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 重载配置
sudo systemctl reload nginx
```

#### 4. SSL 证书问题
```bash
# 检查证书状态
sudo certbot certificates

# 强制续期
sudo certbot renew --force-renewal

# 重新申请证书
sudo certbot delete --cert-name yourdomain.com
sudo certbot --nginx -d yourdomain.com
```

## 📈 性能调优

### 1. Node.js 优化
```bash
# PM2 配置优化
pm2 start ecosystem.config.js --node-args="--max-old-space-size=2048"
```

### 2. Nginx 优化
```nginx
# /etc/nginx/nginx.conf 优化配置
worker_processes auto;
worker_connections 1024;

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=blog_cache:10m max_size=100m;

# 在 server 块中添加
location /api/ {
    proxy_cache blog_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

### 3. 数据库优化（如果使用）
- 定期清理日志文件
- 优化查询索引
- 配置适当的连接池大小

---

**最后更新**: 2025年9月23日
**部署版本**: v2.0.0

## 🆘 获取帮助

如果在部署过程中遇到问题：
1. 查看应用日志: `pm2 logs blog-server`
2. 检查系统资源: `htop` 或 `free -h`
3. 验证服务状态: `systemctl status nginx`
4. 参考故障排除章节
5. 查看项目 README.md 和相关文档