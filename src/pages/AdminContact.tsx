import { useContact } from '../hooks/useContact';
import { Trash2 } from 'lucide-react';

export const AdminContact = () => {
  const { submissions, loading, error, deleteSubmission } = useContact();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteSubmission(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error deleting submission');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Form Submissions</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Full Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Mobile Number</th>
              <th className="px-6 py-3 text-left font-semibold">City</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{submission.fullName}</td>
                <td className="px-6 py-3">{submission.email}</td>
                <td className="px-6 py-3">{submission.mobileNumber}</td>
                <td className="px-6 py-3">{submission.city}</td>
                <td className="px-6 py-3">{new Date(submission.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">No submissions found</div>
        )}
      </div>
    </div>
  );
};
