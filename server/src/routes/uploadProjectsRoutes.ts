import express, { Request, Response } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Project from '../models/projects';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const formatted = rows.map((row: any) => ({
      name: row.name,
      zone: row.zone,
      client: row.client,
      city: row.city,
      sector: row.sector,
      type: row.type,
      year: Number(row.year),
      status: row.status,
      designConsult: row.designConsult,
      pmc: row.pmc,
      costConsult: row.costConsult,
      ProjectManager: row.ProjectManager,
      area: Number(row.area),
      cost: Number(row.cost),
      progress: Number(row.progress),
      location: {
        lat: Number(row.lat),
        lng: Number(row.lng),
        city: row.city,
        address: row.address,
      },
      sitePhotos: [],
    }));

    await Project.insertMany(formatted);

    res.json({ message: `Imported ${formatted.length} projects.` });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload projects.', error: error.message });
  }
});

export default router;