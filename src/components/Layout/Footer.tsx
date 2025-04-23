
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-custom-darkBlue1 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Aptitude Ace</h3>
            <p className="text-gray-300">
              Empowering your learning journey with AI-driven aptitude training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/aptitude" className="text-gray-300 hover:text-white">
                  Aptitude Training
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className="text-gray-300 hover:text-white">
                  Flashcards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: support@aptitudeace.com
              <br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Aptitude Ace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
