import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or declined cookies
    const consent = localStorage.getItem('sheger_cookie_consent');
    if (!consent) {
      // Small delay to make it feel less aggressive
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sheger_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sheger_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[400px] bg-white border border-gray-100 shadow-2xl rounded-2xl z-[9999] overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie size={20} className="text-emerald-600" />
              </div>
              <button 
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              {t('cookie.title', 'We value your privacy')}
            </h3>
            
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {t('cookie.message', 'We use strictly necessary cookies to keep you logged in securely. We also use optional cookies to help us improve the platform. By clicking "Accept", you agree to our use of cookies.')}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {t('cookie.accept', 'Accept Cookies')}
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl transition-colors border border-gray-200"
              >
                {t('cookie.decline', 'Decline Optional')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
