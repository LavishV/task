import Project from '../models/Project.js';
import { unlink } from 'fs/promises';
import path from 'path';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const project = new Project({
      name,
      description,
      imageUrl,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.file) {
      if (project.imageUrl) {
        const oldPath = path.join(process.cwd(), 'uploads', project.imageUrl.split('/').pop());
        try {
          await unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      project.imageUrl = `/uploads/${req.file.filename}`;
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.imageUrl) {
      const filePath = path.join(process.cwd(), 'uploads', project.imageUrl.split('/').pop());
      try {
        await unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
