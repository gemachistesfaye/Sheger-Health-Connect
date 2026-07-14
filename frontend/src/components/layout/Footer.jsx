import React from 'react';
import { Github, Send, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-end gap-10">
          
          {/* Right Section: Developer & Contact */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="space-y-1 text-left md:text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Core</p>
              <h4 className="text-sm font-bold text-gray-900">Software Developer: Gemachis Tesfaye</h4>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Phone size={14} className="text-emerald-500" />
                <span>0976601074</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <a 
                  href="https://github.com/gemachistesfaye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                >
                  <Github size={16} />
                </a>
                <a 
                  href="mailto:gemachistesfaye36@gmail.com" 
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  <Mail size={16} />
                </a>
                <a 
                  href="https://t.me/urjiiko1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                >
                  <Send size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Left Section: Copyright & Legal */}
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Advanced Health Intelligence</p>
            <p className="text-xs font-medium text-gray-500 mb-3">© 2026 Sheger Health Connect. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">Privacy Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">Terms of Service</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-500 hover:text-emerald-600 transition-colors font-medium">Data Policy</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
