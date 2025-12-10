import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      setIsOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
          <li><a href="#home" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Home</a></li>
          <li><a href="#services" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Services</a></li>
          <li><a href="#projects" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Projects</a></li>
          <li><a href="#testimonials" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Testimonials</a></li>
          <li><a href="#contact" onClick={handleNavClick} className="hover:text-blue-200 transition cursor-pointer">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};
