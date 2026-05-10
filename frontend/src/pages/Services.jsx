import { motion } from 'framer-motion';

const servicesList = [
  {
    title: "General Consultation",
    price: "300 - 500 ETB",
    description: "Comprehensive medical consultations with experienced physicians for diagnosis and treatment of common ailments, chronic conditions, and preventive care.",
    duration: "30 mins",
    availability: "Mon-Sun"
  },
  {
    title: "Laboratory Services",
    price: "150 - 2,000 ETB",
    description: "State-of-the-art diagnostic laboratory offering accurate and timely test results for blood work, urinalysis, and other essential tests.",
    duration: "Varies",
    availability: "Mon-Sat"
  },
  {
    title: "Maternal & Child Care",
    price: "400 - 800 ETB",
    description: "Dedicated care for mothers and children including prenatal checkups, postnatal care, vaccinations, and pediatric consultations.",
    duration: "45 mins",
    availability: "Mon-Fri"
  },
  {
    title: "Emergency Care",
    price: "500 - 1,500 ETB",
    description: "Prompt medical attention for urgent health concerns and minor injuries. Available during extended hours.",
    duration: "Immediate",
    availability: "24/7"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Our Medical Services
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We provide a wide range of medical services to meet the needs of our patients with compassion and professionalism.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {servicesList.map((svc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{svc.title}</h3>
                  <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">{svc.price}</span>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">{svc.description}</p>
                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-lg">⏱</span>
                    {svc.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-lg">📅</span>
                    {svc.availability}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
