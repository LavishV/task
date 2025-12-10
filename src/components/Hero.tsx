export const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">Consultation, Design, & Marketing</h1>
            <p className="text-xl text-gray-300 mb-8">Professional real estate services tailored to your needs</p>
          </div>
          <div className="bg-blue-600 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Get a Free Consultation</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Area, City"
                className="w-full px-4 py-3 bg-blue-500 placeholder-blue-200 text-white rounded border border-blue-400 focus:outline-none"
              />
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded">
                Get Quick Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
