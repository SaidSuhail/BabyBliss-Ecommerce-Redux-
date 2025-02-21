import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 py-7 px-4 sm:px-6 lg:px-12">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-rose-600 mb-10">
        Contact Us
      </h1>
  
      <div className="flex flex-col md:flex-row gap-10">
        {/* Contact Information */}
        <div className="w-full md:w-1/3 bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            We’d love to hear from you! Reach out for support, inquiries, or feedback.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Email:</h3>
              <p className="text-gray-600">contact@BabyBliss.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Phone:</h3>
              <p className="text-gray-600">+123 456 7890</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Address:</h3>
              <p className="text-gray-600">Calicut, Kerala, India</p>
            </div>
          </div>
        </div>
  
        {/* Contact Form */}
        <div className="w-full md:w-2/3 bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter Your Name"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-semibold">
                Your Message
              </label>
              <textarea
                id="message"
                placeholder="Your message here..."
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows="6"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default ContactPage;
