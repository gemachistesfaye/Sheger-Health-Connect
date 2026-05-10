import React from 'react';
import { Github, Send, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          
          {/* Left Section: Developer & Contact */}
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Core</p>
              <h4 className="text-sm font-bold text-gray-900">Software Developer: Gemachis Tesfaye</h4>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Phone size={14} className="text-emerald-500" />
                <span>0976601074</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <a 
                  href="https://github.com/gemachistesfaye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                >
                  <Github size={16} />
                </a>
                <a 
                  href="https://t.me/urjiiko1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                >
                  <Send size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section: Copyright */}
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">Advanced Health Intelligence</p>
            <p className="text-xs font-medium text-gray-400">© 2026 Sheger Health. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
