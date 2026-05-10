import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const PublicLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="glass-nav">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
            Sheger Care
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('nav.home')}</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('nav.about')}</Link>
            <Link to="/services" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('nav.services')}</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('nav.contact')}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/login"
              className="btn-primary shadow-lg shadow-primary/20"
            >
              {t('nav.bookAppointment')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-12 border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Sheger Care Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
