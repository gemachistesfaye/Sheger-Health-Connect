import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Pill, 
  QrCode, 
  PhoneCall, 
  Download, 
  Heart,
  Zap
} from 'lucide-react';

const HealthSmartCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Hydration Reminder */}
      <motion.div whileHover={{ y: -5 }} className="bg-blue-500 p-6 rounded-[32px] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Droplets size={60} />
        </div>
        <h4 className="font-bold mb-1">Hydration</h4>
        <p className="text-2xl font-black mb-4">1.2 / 2.5L</p>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-[48%]" />
        </div>
      </motion.div>

      {/* Medication Reminder */}
      <motion.div whileHover={{ y: -5 }} className="bg-purple-500 p-6 rounded-[32px] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Pill size={60} />
        </div>
        <h4 className="font-bold mb-1">Medication</h4>
        <p className="text-sm font-medium opacity-90 mb-4">Next: Amoxicillin at 2 PM</p>
        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">
          Mark as Taken
        </button>
      </motion.div>

      {/* QR Patient ID */}
      <motion.div whileHover={{ y: -5 }} className="bg-gray-900 p-6 rounded-[32px] text-white shadow-xl shadow-gray-900/20 flex flex-col items-center justify-center text-center group">
        <div className="bg-white p-2 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
          <QrCode size={40} className="text-gray-900" />
        </div>
        <h4 className="font-bold text-sm mb-1">Digital Patient ID</h4>
        <p className="text-xs text-gray-500">Scan for emergency info</p>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div whileHover={{ y: -5 }} className="bg-red-500 p-6 rounded-[32px] text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <PhoneCall size={60} />
        </div>
        <h4 className="font-bold mb-1">Emergency</h4>
        <p className="text-sm font-medium mb-4">Family: +251 900 000</p>
        <button className="w-full bg-white text-red-500 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
          <Zap size={14} /> Call Clinic
        </button>
      </motion.div>
    </div>
  );
};

export default HealthSmartCards;
