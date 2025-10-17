import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  zone: string;
  client: string;
  city: string;
  sector: string;
  type: string;
  year: number;
  area: number;
  cost: number;
  progress: number;
  status: string;
  designConsult: string;
  pmc: string;
  costConsult: string;
  ProjectManager: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  sitePhotos: {
    url: string;
    date: string;
  }[];
}

const ProjectSchema: Schema<IProject> = new Schema({
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
  mongoose.model<IProject>('Project', ProjectSchema);
