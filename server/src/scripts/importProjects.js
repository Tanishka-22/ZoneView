import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import Project from '../models/projects.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const FILE_PATH = path.join(__dirname, '../data/Projects.xlsx');

async function importProjects() {
try {
await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB');
const workbook = xlsx.readFile(FILE_PATH);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

const formatted = rows.map(row => ({
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
    address: row.address,
  },
  sitePhotos: [],
}));

await Project.insertMany(formatted);
console.log(`✅ Successfully imported ${formatted.length} projects`);
process.exit(0);
} catch (err) {
console.error('❌ Error importing projects:', err);
process.exit(1);
}
}

importProjects();

