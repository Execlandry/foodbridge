import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-3xl font-bold text-green-400">FoodBridge</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Connecting businesses with surplus food to those in need.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-green-400">Quick Links</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>
              <Link to="/about" className="hover:text-green-300">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-300">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-green-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-green-300">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold text-green-400">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition"
            >
              <FaFacebookF className="text-white w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition"
            >
              <FaInstagram className="text-white w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition"
            >
              <FaTwitter className="text-white w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition"
            >
              <FaLinkedinIn className="text-white w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} FoodBridge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
