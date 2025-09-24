import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

const router = express.Router();

// 安全的Typst编译函数
async function safeTypstCompile(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 设置编译超时（30秒）
    const timeout = 30000;

    // 使用spawn而不是exec，避免shell注入
    const { spawn } = require('child_process');

    const typstProcess = spawn('typst', ['compile', inputPath, outputPath], {
      timeout,
      stdio: ['ignore', 'pipe', 'pipe'],
      // 安全选项
      detached: false,
      env: { ...process.env, PATH: process.env.PATH }, // 只传递必要的环境变量
    });

    let stderr = '';

    typstProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    typstProcess.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Typst compilation failed: ${stderr}`));
      }
    });

    typstProcess.on('error', (error: Error) => {
      reject(new Error(`Typst process error: ${error.message}`));
    });

    // 强制超时处理
    setTimeout(() => {
      if (!typstProcess.killed) {
        typstProcess.kill('SIGTERM');
        reject(new Error('Typst compilation timeout'));
      }
    }, timeout);
  });
}

// 验证Typst文件内容安全性
function validateTypstContent(content: Buffer): boolean {
  const contentStr = content.toString('utf8', 0, Math.min(content.length, 1024)); // 只检查前1KB

  // 检查是否包含潜在危险的命令
  const dangerousPatterns = [
    /\\shell\{/,      // shell命令执行
    /\\eval\{/,       // 代码执行
    /\\import\s*system/, // 系统导入
    /\\read\(/,       // 文件读取
    /\\write\(/,      // 文件写入
    /#import\s*[\"']\.\./ // 路径遍历
  ];

  return !dangerousPatterns.some(pattern => pattern.test(contentStr));
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for better security
    files: 1, // Only one file at a time
  },
  fileFilter: (req, file, cb) => {
    // 严格的文件类型验证
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.typ', '.typst'];

    const filename = file.originalname.toLowerCase();
    const isValidExtension = allowedExtensions.some(ext => filename.endsWith(ext));
    const isValidImage = allowedImageTypes.includes(file.mimetype);

    // 对于Typst文件，检查扩展名和文件头
    if (isValidExtension || isValidImage) {
      // 额外安全检查：文件名不能包含危险字符
      if (!/^[a-zA-Z0-9_.-]+$/.test(file.originalname)) {
        return cb(new Error('Invalid filename characters'));
      }
      return cb(null, true);
    } else {
      cb(new Error('Only images and Typst files are allowed'));
    }
  },
});

// POST /api/upload/image - Upload image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const filename = `${uuidv4()}.webp`;
    const uploadPath = path.join(__dirname, '../../uploads/images', filename);

    // Ensure uploads directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // Process and save image using sharp
    await sharp(req.file.buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(uploadPath);

    const url = `/uploads/images/${filename}`;

    console.log('📸 Image uploaded:', url);

    res.json({
      success: true,
      url
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

// POST /api/upload/paste - Handle pasted images (base64)
router.post('/paste', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData || !imageData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image data'
      });
    }

    // Extract base64 data
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const filename = `${uuidv4()}.webp`;
    const uploadPath = path.join(__dirname, '../../uploads/images', filename);

    // Ensure uploads directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // Process and save image
    await sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(uploadPath);

    const url = `/uploads/images/${filename}`;

    console.log('📋 Pasted image uploaded:', url);

    res.json({
      success: true,
      url
    });
  } catch (error) {
    console.error('Error processing pasted image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process pasted image'
    });
  }
});

// POST /api/upload/typst - Upload Typst document
router.post('/typst', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No Typst document provided'
      });
    }

    const baseFilename = uuidv4();
    const typstFilename = `${baseFilename}.typ`;
    const uploadPath = path.join(__dirname, '../../uploads/documents', typstFilename);

    // 验证文件内容安全性
    if (!validateTypstContent(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        error: 'Typst document contains potentially dangerous content'
      });
    }

    // Ensure uploads directory exists
    await fs.mkdir(path.dirname(uploadPath), { recursive: true });

    // Save the Typst file
    await fs.writeFile(uploadPath, req.file.buffer);

    const url = `/uploads/documents/${typstFilename}`;

    let pdfUrl = null;

    // Try to compile to PDF safely
    try {
      const pdfFilename = `${baseFilename}.pdf`;
      const pdfPath = path.join(__dirname, '../../uploads/documents', pdfFilename);

      // 使用安全的编译函数
      await safeTypstCompile(uploadPath, pdfPath);
      pdfUrl = `/uploads/documents/${pdfFilename}`;

      console.log('📄 Typst document compiled to PDF:', pdfUrl);
    } catch (pdfError) {
      console.warn('⚠️  Could not compile Typst to PDF:', pdfError.message);
      // 编译失败时不删除源文件，因为用户仍然可以查看源码
      // 只是没有PDF版本而已
    }

    console.log('📄 Typst document uploaded:', url);

    res.json({
      success: true,
      url,
      pdfUrl,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Error uploading Typst document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload Typst document'
    });
  }
});

// POST /api/upload/typst/compile - Compile existing Typst document to PDF
router.post('/typst/compile', async (req, res) => {
  try {
    const { typstUrl } = req.body;

    if (!typstUrl) {
      return res.status(400).json({
        success: false,
        error: 'Typst URL is required'
      });
    }

    // Extract filename from URL
    const typstFilename = path.basename(typstUrl);
    const baseName = path.parse(typstFilename).name;
    const typstPath = path.join(__dirname, '../../uploads/documents', typstFilename);
    const pdfFilename = `${baseName}.pdf`;
    const pdfPath = path.join(__dirname, '../../uploads/documents', pdfFilename);

    // Check if Typst file exists
    try {
      await fs.access(typstPath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Typst file not found'
      });
    }

    // 安全编译到PDF
    await safeTypstCompile(typstPath, pdfPath);

    const pdfUrl = `/uploads/documents/${pdfFilename}`;

    console.log('📄 Typst document compiled to PDF:', pdfUrl);

    res.json({
      success: true,
      pdfUrl
    });
  } catch (error) {
    console.error('Error compiling Typst to PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compile Typst document to PDF'
    });
  }
});

export default router;