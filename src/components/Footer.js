import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between md:items-start">
        {/* About Section */}
        <div className="mb-8 md:mb-0 md:w-1/4">
          <h4 className="text-xl font-bold mb-3 text-red-600">CineCue</h4>
          <p>Your ultimate destination for movies and entertainment.</p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0 md:w-1/4">
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul>
            <li className="mb-2 hover:text-red-600">
              <a href="/">Home</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/movies">Movies</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/tv-shows">TV Shows</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/my-list">My List</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="mb-8 md:mb-0 md:w-1/4">
          <h4 className="text-lg font-semibold mb-3">Support</h4>
          <ul>
            <li className="mb-2 hover:text-red-600">
              <a href="/help">Help Center</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/contact">Contact Us</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li className="mb-2 hover:text-red-600">
              <a href="/terms">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="md:w-1/4">
          <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-red-600">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-red-600">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-red-600">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-red-600">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
        &copy; 2025 CineCue. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
