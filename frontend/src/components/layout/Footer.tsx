import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Get Started', href: '/' },
    ],
    learnMore: [
      { name: 'About PropGrowthX', href: '/about-us' },
      { name: 'Blog', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Contact Us', href: '/contact' },
    ],
  };

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold">
                PropGrowthX
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              The digital twin platform that lets you operate rental properties remotely.
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                India
              </span>
              <a href="mailto:contact@propgrowthx.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-red-600" />
                contact@propgrowthx.com
              </a>
              <a href="tel:+919876543211" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-red-600" />
                +91 9876543211
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn More Links */}
          <div>
            <h4 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-6">Learn More</h4>
            <ul className="space-y-3">
              {footerLinks.learnMore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-bold text-red-600 text-sm uppercase tracking-wider mb-6">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white hover:text-red-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white hover:text-red-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white hover:text-red-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} PropGrowthX | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
