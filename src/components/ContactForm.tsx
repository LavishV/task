import { useState } from 'react';
import { useContact } from '../hooks/useContact';

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
    try {
      await submitContact(formData);
      setMessage('Thank you! Your inquiry has been submitted successfully.');
      setFormData({ fullName: '', email: '', mobileNumber: '', city: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
      setTimeout(() => setMessage(''), 3000);
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
            <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-200' : 'text-red-200'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
