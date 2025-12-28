import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  zone: String,
  client: String,
  city: String,
  sector: String,
  type: String,
  year: Number,
  area: Number,
  cost: Number,
  progress: Number,
  status: String,
  designConsult: String,
  pmc: String,
  costConsult: String,
  ProjectManager: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  sitePhotos: [
    {
      url: String,
      date: String,
    },
  ],
});

export default mongoose.models.Project ||
  mongoose.model('Project', ProjectSchema);

