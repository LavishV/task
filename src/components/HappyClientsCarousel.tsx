import { sampleTestimonials } from '../data/sampleData';

export const HappyClientsCarousel = () => {
    // Duplicate testimonials to create seamless infinite scrolling
    const duplicatedTestimonials = [...sampleTestimonials, ...sampleTestimonials];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Happy Clients</h2>
                    <p className="text-lg text-gray-600">What our satisfied clients have to say</p>
                </div>

                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                    {/* Scrolling Wrapper */}
                    <div className="carousel-scroll">
                        <div className="carousel-track flex gap-6">
                            {duplicatedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`${testimonial.id}-${index}`}
                                    className="carousel-card flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-8"
                                >
                                    {/* Client Avatar */}
                                    <div className="flex items-center justify-center mb-6">
                                        <img
                                            src={testimonial.imageUrl}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                                        />
                                    </div>

                                    {/* Testimonial Message */}
                                    <p className="text-gray-600 text-center italic mb-6 line-clamp-3 min-h-20">
                                        "{testimonial.description}"
                                    </p>

                                    {/* Client Info */}
                                    <div className="text-center">
                                        <h3 className="font-bold text-blue-600 text-lg">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.designation}</p>
                                    </div>

                                    {/* Stars Rating */}
                                    <div className="flex justify-center mt-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">★</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">← Scroll to see more testimonials →</p>
                </div>
            </div>
        </section>
    );
};

export default HappyClientsCarousel;
