import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: "General Consultation",
      description: "Comprehensive medical consultations with experienced physicians."
    },
    {
      title: "Laboratory Services",
      description: "State-of-the-art diagnostic laboratory offering accurate test results."
    },
    {
      title: "Emergency Care",
      description: "Prompt medical attention for urgent health concerns and injuries."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-24 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Sheger Care Clinic
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed"
          >
            Providing compassionate and professional medical care to the Addis Ababa community. Your health is our priority.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="btn-primary w-full sm:w-auto shadow-xl shadow-primary/20">
              Book Appointment
            </Link>
            <a href="tel:+251976601074" className="btn-outline w-full sm:w-auto">
              Call Now: +251 976 601 074
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="service-card"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
