import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (formData: FormData) => {
    try {
      const response = await projectAPI.create(formData);
      setProjects([response.data, ...projects]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create project');
    }
  };

  const updateProject = async (id: string, formData: FormData) => {
    try {
      const response = await projectAPI.update(id, formData);
      setProjects(projects.map(p => (p.id === id ? response.data : p)));
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete project');
    }
  };

  return { projects, loading, error, createProject, updateProject, deleteProject, fetchProjects };
};
