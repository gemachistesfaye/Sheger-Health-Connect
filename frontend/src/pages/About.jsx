// src/pages/About.jsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4 text-primary">{t('about.title')}</h2>
        <p className="text-gray-700 mb-6">{t('about.mission')}</p>
        <p className="text-gray-700 mb-6">{t('about.vision')}</p>
        <p className="text-gray-700">{t('about.values')}</p>
      </motion.div>
    </section>
  );
};

export default About;
