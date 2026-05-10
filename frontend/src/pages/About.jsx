import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  ShieldCheck, 
  Globe, 
  Award, 
  CheckCircle2, 
  Zap,
  Activity,
  Heart
} from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="bg-gray-900 rounded-[60px] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-emerald-400 mb-8"
              >
                 <Target size={14} /> Our Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-black mb-8 leading-tight tracking-tighter"
              >
                 Democratizing Healthcare for <span className="text-emerald-400">120 Million</span> Ethiopians.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-gray-400 leading-relaxed font-medium"
              >
                 Sheger Health Connect is building the digital infrastructure to make quality medical care accessible, affordable, and instant—from Addis Ababa to the furthest regions of Ethiopia.
              </motion.p>
           </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container mx-auto px-6 mb-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Radical Access", desc: "No matter where you are, a world-class doctor is just a tap away.", icon: Globe, color: "text-blue-500" },
              { title: "Data Privacy", desc: "We use bank-level encryption to ensure your medical records are for your eyes only.", icon: ShieldCheck, color: "text-emerald-500" },
              { title: "AI Innovation", desc: "Harnessing the power of machine learning to provide early diagnosis and triage.", icon: Zap, color: "text-purple-500" }
            ].map((v, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all"
              >
                 <div className={`w-16 h-16 ${v.color} bg-gray-50 rounded-3xl flex items-center justify-center mb-8`}>
                    <v.icon size={32} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 mb-4">{v.title}</h3>
                 <p className="text-gray-500 text-sm leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-emerald-600 py-24 mb-32 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10">
            <Activity className="absolute -top-20 -left-20 w-96 h-96" />
            <Heart className="absolute -bottom-20 -right-20 w-96 h-96" />
         </div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
               {[
                 { val: "500+", label: "Medical Specialists" },
                 { val: "10k+", label: "Happy Patients" },
                 { val: "24/7", label: "Availability" },
                 { val: "15m", label: "Avg. Response Time" }
               ].map((s, i) => (
                 <div key={i}>
                    <p className="text-4xl font-black mb-2 tracking-tighter">{s.val}</p>
                    <p className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">{s.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Leadership / Team Concept */}
      <section className="container mx-auto px-6 text-center">
         <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-16 tracking-tight">Led by Medical Pioneers</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group">
                 <div className="w-full h-80 bg-gray-100 rounded-[40px] mb-6 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">👩‍⚕️</div>
                 </div>
                 <h4 className="text-xl font-bold text-gray-900 mb-1">Founder / MD</h4>
                 <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Leadership Team</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default About;
