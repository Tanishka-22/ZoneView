export interface IProject {
  _id: string;
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