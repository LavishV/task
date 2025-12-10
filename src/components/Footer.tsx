import { useState } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';
import { getErrorMessage } from '../services/api';

export const Footer = () => {
  const { subscribe } = useNewsletter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    try {
      await subscribe(email);
      setMessage('Subscribed successfully! Thank you for joining our newsletter.');
      setEmail('');
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setMessage(`Error: ${errorMsg}`);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-blue-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <nav className="flex gap-6">
            <a href="#home" className="hover:text-blue-200">Home</a>
            <a href="#services" className="hover:text-blue-200">Services</a>
            <a href="#projects" className="hover:text-blue-200">Projects</a>
            <a href="#testimonials" className="hover:text-blue-200">Testimonials</a>
            <a href="#contact" className="hover:text-blue-200">Contact</a>
          </nav>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-gray-200 text-blue-600 font-bold px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            message.includes('successfully') || message.includes('Thank')
              ? 'bg-green-500 border border-green-400'
              : 'bg-red-500 border border-red-400'
          }`}>
            <span className="text-white text-xl font-bold">
              {message.includes('successfully') || message.includes('Thank') ? '✓' : '✕'}
            </span>
            <p className="text-white text-sm">
              {message}
            </p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-blue-500 text-center text-blue-100">
          <p>&copy; 2024 Real Estate Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
