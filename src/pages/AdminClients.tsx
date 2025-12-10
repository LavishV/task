import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { Trash2 } from 'lucide-react';

export const AdminClients = () => {
  const { clients, loading, error, createClient, deleteClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', designation: '', description: '', image: null as File | null });
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('designation', formData.designation);
      form.append('description', formData.description);
      if (formData.image) {
        form.append('image', formData.image);
      }
      await createClient(form);
      setFormData({ name: '', designation: '', description: '', image: null });
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error creating client');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error deleting client');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Add New Client</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Client Name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation (e.g., CEO, Web Developer)"
              value={formData.designation}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <textarea
              name="description"
              placeholder="Client Description"
              value={formData.description}
              onChange={handleFormChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 rounded"
            >
              {submitting ? 'Creating...' : 'Create Client'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Designation</th>
              <th className="px-6 py-3 text-left font-semibold">Description</th>
              <th className="px-6 py-3 text-left font-semibold">Image</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{client.name}</td>
                <td className="px-6 py-3">{client.designation}</td>
                <td className="px-6 py-3 truncate max-w-xs">{client.description}</td>
                <td className="px-6 py-3">
                  {client.imageUrl && (
                    <img src={client.imageUrl} alt={client.name} className="h-10 w-10 object-cover rounded-full" />
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">No clients found</div>
        )}
      </div>
    </div>
  );
};
