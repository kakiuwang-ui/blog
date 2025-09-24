# 📡 API接口文档

## 概览

本文档详细描述了博客系统的所有API接口，包括文章管理、文档处理、资源访问等功能。

### 基础信息
- **Base URL**: `http://localhost:5001/api`
- **Content-Type**: `application/json`
- **编码格式**: UTF-8

## 📝 文章管理 API

### 1. 获取所有文章
```http
GET /api/articles
```

**查询参数**:
- `category` (可选): 按分类筛选 (`blog` | `skills` | `projects` | `music` | `resume`)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "article-id",
      "title": "文章标题",
      "content": "文章内容",
      "category": "blog",
      "tags": ["技术", "教程"],
      "author": "作者名",
      "excerpt": "文章摘要",
      "images": ["/uploads/images/image1.jpg"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. 获取单篇文章
```http
GET /api/articles/:id
```

**路径参数**:
- `id`: 文章唯一标识符

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "article-id",
    "title": "文章标题",
    "content": "完整文章内容...",
    "category": "blog",
    "tags": ["技术"],
    "author": "作者名",
    "excerpt": "文章摘要",
    "images": [],
    "typstDocument": "/documents/resume.typ",
    "typstPdf": "/documents/resume.pdf",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. 创建文章
```http
POST /api/articles
```

**请求体**:
```json
{
  "title": "文章标题",
  "content": "文章内容（支持Markdown或Typst格式）",
  "category": "blog",
  "tags": ["标签1", "标签2"],
  "author": "作者名",
  "excerpt": "文章摘要（可选）",
  "images": ["/uploads/images/image1.jpg"],
  "typstDocument": "/documents/document.typ",
  "typstPdf": "/documents/document.pdf"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "generated-id",
    "title": "文章标题",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. 更新文章
```http
PUT /api/articles/:id
```

**请求体**: 同创建文章，但所有字段都是可选的

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "article-id",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. 删除文章
```http
DELETE /api/articles/:id
```

**响应示例**:
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

### 6. Typst文章PDF编译
```http
GET /api/articles/:id/pdf
```

**功能**: 将Typst格式的文章内容编译为PDF并返回

**响应**:
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `inline; filename="article.pdf"`

**特性**:
- 自动检测文章是否为Typst格式（以 `#` 开头）
- 临时文件自动清理（5秒后删除）
- 支持PDF.js查看器参数（如 `#zoom=page-width`）

## 📋 文档管理 API

### 1. 获取所有文档
```http
GET /api/documents
```

**响应示例**:
```json
[
  {
    "id": "doc-id",
    "name": "document.typ",
    "type": "typst",
    "path": "/documents/document.typ",
    "size": 2048,
    "lastModified": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. 获取文档内容
```http
GET /api/documents/:id
```

**响应**: 文档原始内容（纯文本）

### 3. 文档PDF编译
```http
GET /api/documents/:id/pdf
```

**功能**: 将Typst文档编译为PDF并返回

**响应**:
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `inline; filename="document.pdf"`

### 4. 下载文档
```http
GET /api/documents/:id/download
```

**功能**: 下载原始文档文件

**响应**:
- **Content-Type**: 根据文件类型确定
- **Content-Disposition**: `attachment; filename="document.typ"`

## 🖼️ 资源管理 API

### 1. 图片上传
```http
POST /api/uploads/images
```

**请求**: `multipart/form-data`
- `image`: 图片文件

**响应示例**:
```json
{
  "success": true,
  "data": {
    "url": "/uploads/images/filename.jpg",
    "filename": "filename.jpg",
    "size": 102400
  }
}
```

### 2. 访问上传的图片
```http
GET /uploads/images/:filename
```

**响应**: 图片文件（JPEG, PNG, GIF, WebP等）

## 🔧 系统状态 API

### 1. 健康检查
```http
GET /api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "2.0.0"
}
```

### 2. 系统信息
```http
GET /api/info
```

**响应示例**:
```json
{
  "name": "Rusty Raven Blog System",
  "version": "2.0.0",
  "environment": "development",
  "features": {
    "typstCompilation": true,
    "multiLanguage": true,
    "darkMode": true
  }
}
```

## 🚨 错误处理

### 错误响应格式
```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE",
  "details": {
    "field": "具体错误信息"
  }
}
```

### 常见HTTP状态码
- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

### 常见错误类型

#### 1. 文章相关错误
```json
{
  "success": false,
  "error": "Article not found",
  "code": "ARTICLE_NOT_FOUND"
}
```

#### 2. Typst编译错误
```json
{
  "success": false,
  "error": "Failed to compile Typst content",
  "code": "TYPST_COMPILATION_ERROR",
  "details": {
    "message": "Typst compilation failed: syntax error at line 10"
  }
}
```

#### 3. 文件上传错误
```json
{
  "success": false,
  "error": "Invalid file type",
  "code": "INVALID_FILE_TYPE",
  "details": {
    "allowedTypes": ["image/jpeg", "image/png", "image/gif"]
  }
}
```

## 🔒 安全考虑

### 1. 文件类型验证
- 图片上传仅允许 JPEG, PNG, GIF, WebP 格式
- 文档仅支持 `.typ` 和 `.md` 扩展名

### 2. 路径安全
- 所有文件路径都经过验证，防止目录遍历攻击
- 文档ID使用Base64编码，避免直接暴露文件系统路径

### 3. Typst编译安全
- Typst编译在隔离环境中执行
- 临时文件自动清理，防止磁盘空间耗尽
- 编译过程有超时限制

## 📊 性能优化

### 1. 文件缓存
- PDF编译结果临时缓存5秒
- 静态资源自动添加缓存头

### 2. 并发处理
- 文档编译使用异步处理
- 多个API请求可并发执行

### 3. 资源限制
- 单个文件上传最大10MB
- 文档编译超时时间30秒

## 🧪 测试API

### 使用curl测试
```bash
# 获取所有文章
curl -X GET "http://localhost:5001/api/articles"

# 获取特定文章
curl -X GET "http://localhost:5001/api/articles/resume"

# 编译文章为PDF
curl -X GET "http://localhost:5001/api/articles/resume/pdf" --output article.pdf

# 获取文档列表
curl -X GET "http://localhost:5001/api/documents"

# 健康检查
curl -X GET "http://localhost:5001/api/health"
```

### 使用JavaScript测试
```javascript
// 获取文章列表
fetch('/api/articles')
  .then(response => response.json())
  .then(data => console.log(data))

// 创建新文章
fetch('/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '测试文章',
    content: '# 测试内容',
    category: 'blog',
    author: '测试作者'
  })
})
.then(response => response.json())
.then(data => console.log(data))
```

## 📝 使用建议

1. **批量操作**: 避免频繁的小请求，尽量批量处理
2. **错误处理**: 始终检查 `success` 字段，妥善处理错误情况
3. **资源清理**: PDF文件会自动清理，但建议及时下载需要保存的文件
4. **缓存策略**: 对于不经常变化的内容，可以在客户端进行适当缓存

---

**最后更新**: 2025年9月23日
**API版本**: v2.0.0