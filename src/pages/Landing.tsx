import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { HappyClientsCarousel } from '../components/HappyClientsCarousel';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Paperwork</h3>
              <p className="text-gray-600">We handle all the paperwork and legal documentation for you, making the process stress-free.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Design</h3>
              <p className="text-gray-600">Our expert design team creates beautiful, professional presentations for your property.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Marketing</h3>
              <p className="text-gray-600">We use proven marketing strategies to ensure your property reaches the right buyers.</p>
            </div>
          </div>
        </div>
      </section>
      <Projects />
      <HappyClientsCarousel />
      <ContactForm />
      <Footer />
    </div>
  );
};
