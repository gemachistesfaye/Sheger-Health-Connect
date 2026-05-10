import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MessageSquare,
  ChevronRight,
  Activity,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, desc, features, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group"
  >
    <div className={`w-20 h-20 rounded-[32px] ${color} bg-gray-50 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
      <Icon size={36} />
    </div>
    <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{title}</h3>
    <p className="text-gray-500 font-medium leading-relaxed mb-8">{desc}</p>
    <ul className="space-y-4 mb-10">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {f}
        </li>
      ))}
    </ul>
    <Link to="/register" className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
      Get Started <ChevronRight size={16} />
    </Link>
  </motion.div>
);

const Services = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="container mx-auto px-6 mb-24 text-center">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter"
         >
           Our Clinical <span className="text-gradient">Capabilities.</span>
         </motion.h1>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
         >
           We offer a comprehensive suite of digital healthcare services tailored for the modern Ethiopian lifestyle.
         </motion.p>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-6 mb-32">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ServiceCard 
              icon={Smartphone}
              title="24/7 Telemedicine"
              desc="Connect with specialists from anywhere in Ethiopia. No more long travels or waiting lines."
              features={["Live Video Consultations", "Instant Chat Support", "Prescription Refills"]}
              color="text-emerald-600"
            />
            <ServiceCard 
              icon={Sparkles}
              title="Sheger AI Diagnosis"
              desc="Our state-of-the-art AI assistant helps you understand your symptoms in seconds."
              features={["Multi-language Support", "Symptom Triage", "Specialist Recommendations"]}
              color="text-purple-600"
            />
            <ServiceCard 
              icon={ShieldCheck}
              title="Secure Health Vault"
              desc="Your medical records are encrypted and available to you across all your devices."
              features={["Lab Results History", "Digital Prescriptions", "Insurance Integration"]}
              color="text-blue-600"
            />
            <ServiceCard 
              icon={CreditCard}
              title="Smart Payments"
              desc="Seamlessly pay for your consultations using local mobile money providers."
              features={["TeleBirr Integration", "CBE Birr Support", "Family Billing Plans"]}
              color="text-orange-600"
            />
         </div>
      </section>

      {/* Specialty Banner */}
      <section className="container mx-auto px-6">
         <div className="bg-emerald-600 rounded-[60px] p-12 lg:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
               <Activity className="absolute -top-20 -left-20 w-96 h-96" />
            </div>
            <div className="relative z-10 max-w-xl">
               <h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">Specialized Care in <br />Every Department.</h2>
               <p className="text-emerald-100 font-medium text-lg leading-relaxed mb-8">
                 From Cardiology to Pediatrics, we have certified experts in over 25+ medical fields ready to assist you.
               </p>
               <div className="flex flex-wrap gap-3">
                  {["Cardiology", "Pediatrics", "Dermatology", "Neurology", "Psychiatry"].map((tag, i) => (
                    <span key={i} className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-bold border border-white/10">{tag}</span>
                  ))}
               </div>
            </div>
            <div className="relative z-10 w-full lg:w-96 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 shadow-2xl">
               <h4 className="text-xl font-black mb-6">Need a Specialist?</h4>
               <p className="text-sm text-emerald-100 mb-8 font-medium">Use our automated matchmaker to find the best doctor for your specific needs.</p>
               <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm shadow-xl">Launch Matchmaker</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Services;
