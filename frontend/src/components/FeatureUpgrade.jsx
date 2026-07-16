import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Clock } from 'lucide-react';

const FeatureUpgrade = ({ title }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-8 uppercase tracking-widest border border-emerald-100">
          <Clock size={14} />
          <span>Coming to v2.0</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Redesigning the <br />
          <span className="text-gradient">{title} Experience.</span>
        </h2>
        
        <p className="text-lg text-gray-500 mb-12 leading-relaxed">
          This feature is being upgraded for the new ShegerHealth platform. We're building a futuristic, AI-driven interface to manage your healthcare journey.
        </p>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Zap, text: "AI-Powered Automation", label: "Intelligence" },
            { icon: ShieldCheck, text: "Advanced Encryption", label: "Security" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white border border-gray-100 rounded-3xl text-left flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Under Development
          </div>
          <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            Notify Me When Ready <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Decorative Floating Icon */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-10 right-10 opacity-10"
      >
        <Activity size={200} />
      </motion.div>
    </div>
  );
};

export default FeatureUpgrade;
