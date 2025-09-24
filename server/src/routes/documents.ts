import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const execAsync = promisify(exec);

// Documents directory path
const DOCUMENTS_DIR = path.join(__dirname, '../../documents');
const COMPILED_DIR = path.join(__dirname, '../../compiled');

// Ensure directories exist
if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}
if (!fs.existsSync(COMPILED_DIR)) {
  fs.mkdirSync(COMPILED_DIR, { recursive: true });
}

interface DocumentFile {
  id: string;
  name: string;
  type: 'markdown' | 'typst';
  path: string;
  size: number;
  lastModified: string;
}

// Security: Validate file path to prevent directory traversal
function validateFilePath(filePath: string): boolean {
  const normalizedPath = path.normalize(filePath);
  return !normalizedPath.includes('..') && !path.isAbsolute(normalizedPath);
}

// Compile Typst to PDF with security checks
async function compileTypstToPDF(inputPath: string, outputPath: string): Promise<void> {
  try {
    // Validate input path
    if (!fs.existsSync(inputPath)) {
      throw new Error('Input file does not exist');
    }

    // Check file size
    const stats = fs.statSync(inputPath);
    const maxSize = process.env.TYPST_MAX_FILE_SIZE ? parseInt(process.env.TYPST_MAX_FILE_SIZE) : 10 * 1024 * 1024;

    if (stats.size > maxSize) {
      throw new Error('File size exceeds limit');
    }

    // Compile with timeout
    const timeout = process.env.TYPST_TIMEOUT ? parseInt(process.env.TYPST_TIMEOUT) : 30000;
    const command = `cd "${path.dirname(inputPath)}" && timeout ${timeout/1000}s typst compile "${path.basename(inputPath)}" "${outputPath}"`;

    await execAsync(command, { timeout });
  } catch (error) {
    console.error('Typst compilation error:', error);
    throw new Error('Failed to compile Typst document');
  }
}

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents: DocumentFile[] = [];

    if (!fs.existsSync(DOCUMENTS_DIR)) {
      return res.json(documents);
    }

    const files = fs.readdirSync(DOCUMENTS_DIR);

    for (const file of files) {
      const filePath = path.join(DOCUMENTS_DIR, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase();
        let type: 'markdown' | 'typst' | null = null;

        if (ext === '.md' || ext === '.markdown') {
          type = 'markdown';
        } else if (ext === '.typ') {
          type = 'typst';
        }

        if (type) {
          documents.push({
            id: Buffer.from(file).toString('base64'),
            name: file,
            type,
            path: filePath,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
          });
        }
      }
    }

    // Sort by last modified date (newest first)
    documents.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    res.json(documents);
  } catch (error) {
    console.error('Error loading documents:', error);
    res.status(500).json({ error: 'Failed to load documents' });
  }
});

// Get document content
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const filePath = path.join(DOCUMENTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filename).toLowerCase();

    if (ext === '.md' || ext === '.markdown') {
      // Convert markdown to HTML
      const html = marked(content);
      res.send(html);
    } else {
      // Return raw content for Typst files
      res.send(content);
    }
  } catch (error) {
    console.error('Error loading document content:', error);
    res.status(500).json({ error: 'Failed to load document content' });
  }
});

// Download document
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const filePath = path.join(DOCUMENTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// Compile Typst document to PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const filePath = path.join(DOCUMENTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    if (ext !== '.typ') {
      return res.status(400).json({ error: 'Only Typst files can be compiled to PDF' });
    }

    // Generate PDF filename
    const pdfName = path.basename(filename, '.typ') + '.pdf';
    const pdfPath = path.join(COMPILED_DIR, pdfName);

    // Check if PDF exists and is newer than source file
    let needsCompilation = true;
    if (fs.existsSync(pdfPath)) {
      const sourceStats = fs.statSync(filePath);
      const pdfStats = fs.statSync(pdfPath);
      needsCompilation = sourceStats.mtime > pdfStats.mtime;
    }

    // Compile if needed
    if (needsCompilation) {
      await compileTypstToPDF(filePath, pdfPath);
    }

    // Serve the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdfName}"`);
    res.sendFile(pdfPath);
  } catch (error) {
    console.error('Error compiling/serving PDF:', error);
    res.status(500).json({ error: 'Failed to compile or serve PDF' });
  }
});

// Download compiled PDF
router.get('/:id/pdf/download', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = Buffer.from(id, 'base64').toString('utf-8');
    const filePath = path.join(DOCUMENTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    if (ext !== '.typ') {
      return res.status(400).json({ error: 'Only Typst files can be compiled to PDF' });
    }

    // Generate PDF filename
    const pdfName = path.basename(filename, '.typ') + '.pdf';
    const pdfPath = path.join(COMPILED_DIR, pdfName);

    // Compile if needed
    let needsCompilation = true;
    if (fs.existsSync(pdfPath)) {
      const sourceStats = fs.statSync(filePath);
      const pdfStats = fs.statSync(pdfPath);
      needsCompilation = sourceStats.mtime > pdfStats.mtime;
    }

    if (needsCompilation) {
      await compileTypstToPDF(filePath, pdfPath);
    }

    // Download the PDF
    res.download(pdfPath, pdfName);
  } catch (error) {
    console.error('Error compiling/downloading PDF:', error);
    res.status(500).json({ error: 'Failed to compile or download PDF' });
  }
});

export default router;