import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Activity } from "lucide-react";

const PublicLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Premium Sticky Glass Navbar */}
      <nav className="glass-nav mt-6 fixed top-0 left-0 right-0 z-[100]">
        <div className="px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
              <Activity size={24} />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">Sheger Health</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">{t('nav.home')}</Link>
            <Link to="/about" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">{t('nav.about')}</Link>
            <Link to="/services" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">{t('nav.services')}</Link>
            <Link to="/contact" className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">{t('nav.contact')}</Link>
          </nav>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform active:scale-95"
            >
              Join Platform
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
