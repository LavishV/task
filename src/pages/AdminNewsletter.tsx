import { useNewsletter } from '../hooks/useNewsletter';
import { Trash2 } from 'lucide-react';

export const AdminNewsletter = () => {
  const { subscriptions, loading, error, deleteSubscription } = useNewsletter();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error deleting subscription');
      }
    }
  };

  const handleExport = () => {
    const csv = subscriptions.map(s => s.email).join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'newsletter_subscriptions.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Newsletter Subscribers ({subscriptions.length})</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Export CSV
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Subscription Date</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map(subscription => (
              <tr key={subscription.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{subscription.email}</td>
                <td className="px-6 py-3">{new Date(subscription.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscriptions.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">No subscribers found</div>
        )}
      </div>
    </div>
  );
};
