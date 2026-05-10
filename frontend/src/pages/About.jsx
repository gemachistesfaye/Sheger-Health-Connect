import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {t('about.title')}
          </motion.h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission')}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.vision')}
              </p>
            </div>

            <div className="bg-primary/5 p-12 rounded-3xl border border-primary/10">
              <h2 className="text-2xl font-bold text-primary mb-4 tracking-tight text-center">Core Values</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center italic">
                {t('about.values')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
