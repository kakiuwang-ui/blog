import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ArticleService } from '../services/articleService.js';

// Detect if content is Typst format by looking for Typst-specific syntax
function isTypstContent(content: string): boolean {
  if (!content) return false;

  // Look for Typst-specific syntax patterns
  return content.includes('#import') ||
         content.includes('#set ') ||
         content.includes('#show ') ||
         (content.startsWith('#') && content.includes('= '));
}

const router = express.Router();
const articleService = new ArticleService();
const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPILED_DIR = path.join(__dirname, '../../compiled');

// Ensure compiled directory exists
if (!fs.existsSync(COMPILED_DIR)) {
  fs.mkdirSync(COMPILED_DIR, { recursive: true });
}

// Compile Typst content to PDF
async function compileTypstContentToPDF(content: string, outputPath: string): Promise<void> {
  try {
    // Define documents directory where resources are located
    const documentsDir = path.join(__dirname, '../../documents');

    // Create a temporary file for the Typst content in documents directory
    const tempPath = path.join(documentsDir, `temp_${Date.now()}.typ`);
    fs.writeFileSync(tempPath, content);

    // Compile to PDF from documents directory so resources can be found
    const command = `cd "${documentsDir}" && typst compile "${path.basename(tempPath)}" "${outputPath}"`;
    await execAsync(command);

    // Clean up temporary file
    fs.unlinkSync(tempPath);
  } catch (error) {
    console.error('Typst compilation error:', error);
    throw new Error('Failed to compile Typst content');
  }
}

// GET /api/articles - Get all articles or filter by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (category && typeof category === 'string') {
      const result = await articleService.getArticlesByCategory(category as any);
      return res.json(result);
    }

    const result = await articleService.getAllArticles();
    res.json(result);
  } catch (error) {
    console.error('Error in GET /articles:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/articles/:id - Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await articleService.getArticleById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in GET /articles/:id:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/articles - Create new article
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags, author, excerpt, images, typstDocument, typstPdf } = req.body;

    console.log('📝 Creating article:', { title, category, author });

    if (!title || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, content, category, author'
      });
    }

    const result = await articleService.createArticle({
      title,
      content,
      category,
      tags: tags || [],
      author,
      excerpt: excerpt || content.substring(0, 200) + '...',
      images: images || [],
      typstDocument,
      typstPdf
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /articles:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /api/articles/:id - Update article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('📝 Updating article:', id);

    const result = await articleService.updateArticle(id, updateData);

    if (!result.success) {
      const status = result.error === 'Article not found' ? 404 : 500;
      return res.status(status).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in PUT /articles/:id:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/articles/:id - Delete article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️  Deleting article:', id);

    const result = await articleService.deleteArticle(id);

    if (!result.success) {
      const status = result.error === 'Article not found' ? 404 : 500;
      return res.status(status).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in DELETE /articles/:id:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/articles/:id/pdf - Compile Typst article to PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const articleResult = await articleService.getArticleById(id);

    if (!articleResult.success) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = articleResult.data;

    // Check if content is Typst format
    if (!isTypstContent(article.content)) {
      return res.status(400).json({ error: 'Article is not in Typst format' });
    }

    // Generate PDF filename
    const pdfName = `article_${id}_${Date.now()}.pdf`;
    const pdfPath = path.join(COMPILED_DIR, pdfName);

    // Compile Typst content to PDF
    await compileTypstContentToPDF(article.content, pdfPath);

    // Serve the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="article.pdf"`);
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error sending PDF:', err);
      } else {
        // Clean up the PDF file after sending
        setTimeout(() => {
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Error compiling article to PDF:', error);
    res.status(500).json({ error: 'Failed to compile article to PDF' });
  }
});

export default router;