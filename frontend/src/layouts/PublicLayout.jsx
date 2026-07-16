import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Activity, Menu, X } from "lucide-react";
import Footer from "../components/layout/Footer";

const PublicLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/about", label: t('nav.about') },
    { to: "/services", label: t('nav.services') },
    { to: "/contact", label: t('nav.contact') },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-emerald-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-2xl focus:font-bold focus:shadow-xl"
      >
        Skip to main content
      </a>
      
      <nav className="glass-nav flex items-center justify-between px-6 py-4" role="navigation" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Sheger Health Connect Home">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
            <Activity size={20} className="text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tight hidden sm:block">Sheger Health</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                location.pathname === link.to 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link 
            to="/login" 
            className="hidden sm:flex px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            {t('nav.login')}
          </Link>
          <Link 
            to="/register" 
            className="hidden sm:flex px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {t('nav.register')}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobile}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === link.to 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link 
                  to="/login" 
                  onClick={closeMobile}
                  className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMobile}
                  className="block text-center px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20"
                >
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
