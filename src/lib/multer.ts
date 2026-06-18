import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';

// 1. Define memory storage (preferred for direct Cloudinary uploads via stream)
const memoryStorage = multer.memoryStorage();

// 2. Define temporary disk storage (using OS temp directory to prevent local path dependency failures)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(os.tmpdir(), 'ptumni-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 3. File filter to restrict uploads to images only
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!') as any, false);
  }
};

// 4. Configure upload limits (e.g. 10MB)
const uploadLimits = {
  fileSize: 10 * 1024 * 1024, // 10 Megabytes
};

// 5. Expose configured Multer instances
export const uploadMemory = multer({
  storage: memoryStorage,
  limits: uploadLimits,
  fileFilter: imageFilter,
});

export const uploadDisk = multer({
  storage: diskStorage,
  limits: uploadLimits,
  fileFilter: imageFilter,
});

export default multer;
