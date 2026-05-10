// src/pages/Home.jsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Home = () => {
  const { t } = useTranslation();
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">{t('home.heroSubtitle')}</p>
        <a
          href="/appointment"
          className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
        >
          {t('home.cta')}
        </a>
      </motion.div>
    </section>
  );
};

export default Home;
