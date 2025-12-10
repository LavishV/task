import { useState } from 'react';
import { useContact } from '../hooks/useContact';
import { getErrorMessage } from '../services/api';
import backgroundImage from '../assests/site_background.jpeg';

export const Hero = () => {
  const { submitContact } = useContact();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await submitContact(formData);
      setMessage('✅ Quick quote request submitted successfully! We will contact you soon.');
      setMessageType('success');
      setFormData({ fullName: '', email: '', mobileNumber: '', city: '' });
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setMessage('❌ ' + errorMsg);
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="home" 
      className="text-white py-24 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">Consultation, Design, & Marketing</h1>
            <p className="text-xl text-gray-100 mb-8">Professional real estate services tailored to your needs</p>
          </div>
          <div className="bg-blue-600 rounded-lg p-8 bg-opacity-95">
            <h2 className="text-3xl font-bold mb-6 text-center">Get a Free Consultation</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none focus:border-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none focus:border-white"
              />
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none focus:border-white"
              />
              <input
                type="text"
                name="city"
                placeholder="Area, City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none focus:border-white"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3 rounded transition"
              >
                {loading ? 'Submitting...' : 'Get Quick Quote'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
