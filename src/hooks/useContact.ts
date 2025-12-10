import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';

export interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export const useContact = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setSubmissions(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const submitContact = async (data: { fullName: string; email: string; mobileNumber: string; city: string }) => {
    try {
      const response = await contactAPI.create(data);
      setSubmissions([response.data, ...submissions]);
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit contact form');
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await contactAPI.delete(id);
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete submission');
    }
  };

  return { submissions, loading, error, submitContact, deleteSubmission, fetchSubmissions };
};
