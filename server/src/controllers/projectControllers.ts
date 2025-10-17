import { Request, Response } from 'express';
import Project from '../models/projects';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    // Extract filter parameters from request query
    const filters = req.query;
    
    // Build query object for MongoDB
    const query: any = {};
    
    // Add each filter to the query if it exists
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        // Handle numeric fields
        if (key === 'year' || key === 'cost' || key === 'area' || key === 'progress') {
          query[key] = Number(filters[key]);
        } else {
          query[key] = { $regex: new RegExp(filters[key] as string, 'i') };
        }
      }
    });
    
    console.log('Applying filters:', query);
    
    // Find projects with the specified filters
    const projects = await Project.find(query);
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    console.log('Received payload:', req.body); // Debug log
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Create Project Error:', err); // Debug log
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
   }
};
