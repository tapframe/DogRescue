import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (err) {
      return cb(err as Error, uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const timestamp = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9\.\-_]/g, '_');
    cb(null, `${timestamp}-${safeOriginal}`);
  }
});

const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/uploads
router.post('/', upload.single('image'), (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const filename = file.filename;
  const host = req.get('host');
  const protocol = req.protocol;
  const url = `${protocol}://${host}/uploads/${filename}`;

  return res.status(201).json({ success: true, url, filename });
});

export default router;

