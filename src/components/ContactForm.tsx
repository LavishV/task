import { useState } from 'react';
import { useContact } from '../hooks/useContact';
import { getErrorMessage } from '../services/api';

export const ContactForm = () => {
  const { submitContact } = useContact();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await submitContact(formData);
      setMessage('Thank you! Your inquiry has been submitted successfully.');
      setFormData({ fullName: '', email: '', mobileNumber: '', city: '' });
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
    <section id="contact" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Get a Free Consultation</h2>
        <div className="max-w-md mx-auto bg-blue-700 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-6">Get a Free Consultation</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 placeholder-blue-200 text-white rounded border border-blue-500 focus:outline-none focus:border-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 placeholder-blue-200 text-white rounded border border-blue-500 focus:outline-none focus:border-white"
            />
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 placeholder-blue-200 text-white rounded border border-blue-500 focus:outline-none focus:border-white"
            />
            <input
              type="text"
              name="city"
              placeholder="Area, City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 placeholder-blue-200 text-white rounded border border-blue-500 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded"
            >
              {loading ? 'Submitting...' : 'Get Quick Quote'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${message.includes('successfully')
                ? 'bg-green-100 border border-green-400'
                : 'bg-red-100 border border-red-400'
              }`}>
              <span className={message.includes('successfully') ? 'text-green-600 text-xl' : 'text-red-600 text-xl'}>
                {message.includes('successfully') ? '✓' : '✕'}
              </span>
              <p className={message.includes('successfully') ? 'text-green-700' : 'text-red-700'}>
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
