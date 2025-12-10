import { useState, useEffect } from 'react';
import { newsletterAPI } from '../services/api';

export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const useNewsletter = () => {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await newsletterAPI.getAll();
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const subscribe = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsletterAPI.subscribe(email);
      setSubscriptions([response.data, ...subscriptions]);
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to subscribe to newsletter';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      await newsletterAPI.delete(id);
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete subscription');
    }
  };

  return { subscriptions, loading, error, subscribe, deleteSubscription, fetchSubscriptions };
};
