import { X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  price?: string;
  location?: string;
  imageUrl?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Image */}
            {project.imageUrl && (
              <div className="mb-6 -mx-6">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-80 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {project.price && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Price</h4>
                  <p className="text-2xl font-bold text-blue-600">{project.price}</p>
                </div>
              )}
              {project.location && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
                  <p className="text-lg text-gray-900">{project.location}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
              <a
                href="#contact"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-center"
              >
                Inquire Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
