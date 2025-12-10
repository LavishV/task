import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { sampleProjects } from '../data/sampleData';
import { ProjectModal } from './ProjectModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const Projects = () => {
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use sample projects as fallback when no API data
  const displayProjects = projects && projects.length > 0 ? projects : sampleProjects;

  const handleReadMore = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleRetry = () => {
    refetch?.();
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Projects</h2>
          <div className="text-center text-gray-500">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Projects</h2>
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">Unable to load live projects</p>
                <p className="text-yellow-700 text-sm mt-1">Showing sample projects. {refetch && (
                  <button
                    onClick={handleRetry}
                    className="text-yellow-900 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Retry
                  </button>
                )}</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              {project.imageUrl && (
                <img src={project.imageUrl} alt={project.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-blue-600 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                <button
                  onClick={() => handleReadMore(project)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded transition"
                >
                  READ MORE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
