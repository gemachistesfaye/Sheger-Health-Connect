import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const PublicLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            🏥 Sheger Care
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.home')}</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.about')}</Link>
            <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.services')}</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t('nav.contact')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('nav.bookAppointment')}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-white py-10 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-lg mb-3 text-primary">🏥 Sheger Care</h4>
            <p className="text-slate-400">AI-powered healthcare for every Ethiopian family.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">{t('nav.services')}</h4>
            <ul className="space-y-1 text-slate-400">
              <li>General Consultation</li>
              <li>Emergency Care</li>
              <li>Pediatrics</li>
              <li>Laboratory</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">{t('nav.contact')}</h4>
            <ul className="space-y-1 text-slate-400">
              <li>📍 Addis Ababa, Ethiopia</li>
              <li>📞 +251 976 601 074</li>
              <li>✉️ info@shegercare.et</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} Sheger Care Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
