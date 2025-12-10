import { useClients } from '../hooks/useClients';

export const HappyClients = () => {
  const { clients, loading, error } = useClients();

  if (loading) {
    return (
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Happy Clients</h2>
          <div className="text-center text-gray-500">Loading clients...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Happy Clients</h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Happy Clients</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition">
              {client.imageUrl && (
                <img
                  src={client.imageUrl}
                  alt={client.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{client.description}</p>
              <h3 className="font-bold text-blue-600">{client.name}</h3>
              <p className="text-sm text-gray-500">{client.designation}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
