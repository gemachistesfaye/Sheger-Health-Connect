import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Pill, 
  QrCode, 
  PhoneCall, 
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HealthSmartCards = ({ patientData }) => {
  const { user } = useAuth();
  const hydration = patientData?.hydration || { current: 0, target: 2.5 };
  const nextMedication = patientData?.nextMedication || null;
  const emergencyPhone = patientData?.emergencyPhone || '+251 911 000';

  const hydrationPercent = hydration.target > 0 
    ? Math.min(100, (hydration.current / hydration.target) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div whileHover={{ y: -5 }} className="bg-blue-500 p-6 rounded-[32px] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Droplets size={60} />
        </div>
        <h4 className="font-bold mb-1 text-base">Hydration</h4>
        <p className="text-2xl font-black mb-4 tabular-nums">
          {hydration.current > 0 ? `${hydration.current} / ${hydration.target}L` : 'No data yet'}
        </p>
        {hydration.current > 0 && (
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${hydrationPercent}%` }} />
          </div>
        )}
      </motion.div>

      <motion.div whileHover={{ y: -5 }} className="bg-purple-500 p-6 rounded-[32px] text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Pill size={60} />
        </div>
        <h4 className="font-bold mb-1 text-base">Medication</h4>
        {nextMedication ? (
          <>
            <p className="text-sm font-medium opacity-90 mb-4">Next: {nextMedication.name} at {nextMedication.time}</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Mark as Taken
            </button>
          </>
        ) : (
          <p className="text-sm font-medium opacity-70">No active prescriptions</p>
        )}
      </motion.div>

      <motion.div whileHover={{ y: -5 }} className="bg-gray-900 p-6 rounded-[32px] text-white shadow-xl shadow-gray-900/20 flex flex-col items-center justify-center text-center group">
        <div className="bg-white p-2 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
          <QrCode size={40} className="text-gray-900" />
        </div>
        <h4 className="font-bold text-sm mb-1">Digital Patient ID</h4>
        <p className="text-[10px] text-gray-400 font-mono">ID: {user?.id ? `SHC-${String(user.id).padStart(6, '0')}` : 'N/A'}</p>
      </motion.div>

      <motion.div whileHover={{ y: -5 }} className="bg-red-500 p-6 rounded-[32px] text-white shadow-xl shadow-red-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <PhoneCall size={60} />
        </div>
        <h4 className="font-bold mb-1 text-base">Emergency</h4>
        <p className="text-sm font-medium mb-4">Clinic: {emergencyPhone}</p>
        <a href={`tel:${emergencyPhone.replace(/\s/g, '')}`} className="w-full bg-white text-red-500 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
          <Zap size={14} /> Call Clinic
        </a>
      </motion.div>
    </div>
  );
};

export default HealthSmartCards;
