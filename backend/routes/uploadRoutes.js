import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // THE FIX: Provide the full path from the project root
    cb(null, 'backend/uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('document'), (req, res) => {
  res.status(200).send({
    message: 'File uploaded successfully',
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;