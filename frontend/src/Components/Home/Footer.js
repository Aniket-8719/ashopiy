// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 md:pl-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24 px-6 md:px-0">
        {/* Column 1 - About */}
        <div>
          <h2 className="text-lg font-semibold mb-4">About Us</h2>
          <p className="text-sm">
            We are committed to providing shopkeepers with the tools they need
            to manage their inventory efficiently. Our mission is to simplify business operations.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/terms-conditions" className="hover:text-blue-400">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-400">Privacy & Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-blue-400">Shipping Policy</Link></li>
          </ul>
        </div>

        <div>
          <ul className="space-y-2">
            <li><Link to="/contact" className="hover:text-blue-400">Contact Us</Link></li>
            <li><Link to="/cancel-refuds" className="hover:text-blue-400">Cancellation and Refunds</Link></li>
            <li><Link to="/about-us" className="hover:text-blue-400">About Us</Link></li>
            {/* <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li> */}
          </ul>
        </div>

        {/* Column 3 - Social Media */}
        {/* <div>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div> */}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-400">&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
