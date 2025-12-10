import { useState, useEffect } from 'react';
import { clientAPI } from '../services/api';

export interface Client {
  id: string;
  name: string;
  designation: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async (formData: FormData) => {
    try {
      const response = await clientAPI.create(formData);
      setClients([response.data, ...clients]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create client');
    }
  };

  const updateClient = async (id: string, formData: FormData) => {
    try {
      const response = await clientAPI.update(id, formData);
      setClients(clients.map(c => (c.id === id ? response.data : c)));
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update client');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientAPI.delete(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete client');
    }
  };

  return { clients, loading, error, createClient, updateClient, deleteClient, fetchClients };
};
