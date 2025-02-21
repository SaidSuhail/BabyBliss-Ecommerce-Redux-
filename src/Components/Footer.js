import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-rose-600 text-white py-8">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About My Baby Bliss</h3>
            <p className="text-sm">
              My Baby Bliss is dedicated to providing the best products and resources for parents
              and their little ones. Our goal is to bring joy and comfort to families everywhere.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="hover:text-gray-200 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fashion" className="hover:text-gray-200 transition">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-200 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-200 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:support@mybabybliss.com" className="hover:text-gray-200 transition">
                support@mybabybliss.com
              </a>
            </p>
            <p className="text-sm">Phone: +1-800-123-4567</p>
            <p className="text-sm">Address: 123 Baby Bliss Lane, Blissville, BL 56789</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white mt-8 pt-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} My Baby Bliss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
