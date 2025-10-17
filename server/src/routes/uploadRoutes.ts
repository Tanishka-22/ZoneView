import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/photos', upload.array('images'), async (req, res) => {
try {
if (!req.files || !(req.files instanceof Array)) {
return res.status(400).json({ message: 'No files uploaded' });
}
const uploads = await Promise.all(
  req.files.map(file => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'zoneview' },
        (err, result) => {
          if (err || !result) reject(err);
          else resolve({
            url: result.secure_url,
            date: new Date().toISOString(),
          });
        }
      );
      stream.end(file.buffer);
    });
  })
);

res.json({ photos: uploads });
} catch (err) {
console.error('Upload failed:', err);
res.status(500).json({ message: 'Upload failed' });
}
});

export default router;