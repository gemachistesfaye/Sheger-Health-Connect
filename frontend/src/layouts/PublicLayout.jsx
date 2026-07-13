import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Activity } from "lucide-react";
import Footer from "../components/layout/Footer";

const PublicLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/about", label: t('nav.about') },
    { to: "/services", label: t('nav.services') },
    { to: "/contact", label: t('nav.contact') },
  ];

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
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {t('nav.register')}
          </Link>
        </div>
      </nav>

      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
