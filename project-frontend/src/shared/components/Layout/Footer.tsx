import { Heart, Github, Twitter, Globe, Shield } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-gray-300 ${className}`}>
      <div className="container-padding py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-primary-cyan rounded-lg flex items-center justify-center">
                <span className="text-primary-dark font-bold text-sm">H</span>
              </div>
              <span className="text-white font-bold text-lg">HIWOT</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Blockchain-based humanitarian coordination protocol bringing transparency, 
              privacy, and efficiency to aid delivery across Ethiopia and beyond.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light transition-colors">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors">About Hiwot</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Smart Contracts</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors">Stellar Explorer</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Developer Portal</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Security Audit</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>© {currentYear} Hiwot Protocol</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <a href="#" className="hover:text-primary-light flex items-center space-x-1">
              <Shield size={12} />
              <span>Privacy</span>
            </a>
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart size={12} className="text-red-400 fill-red-400" />
            <span>for humanitarian impact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};