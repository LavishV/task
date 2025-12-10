import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Real Estate Pro</div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`${isOpen ? 'block' : 'hidden'} md:flex gap-8 absolute md:static top-16 left-0 right-0 md:top-auto bg-blue-600 md:bg-transparent p-4 md:p-0`}>
          <li><a href="#home" className="hover:text-blue-200">Home</a></li>
          <li><a href="#services" className="hover:text-blue-200">Services</a></li>
          <li><a href="#projects" className="hover:text-blue-200">Projects</a></li>
          <li><a href="#testimonials" className="hover:text-blue-200">Testimonials</a></li>
          <li><a href="#contact" className="hover:text-blue-200">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};
