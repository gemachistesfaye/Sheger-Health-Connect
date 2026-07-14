import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Globe,
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Users
} from 'lucide-react';
import api from '../lib/api';

const categories = [
  { name: 'All', icon: Stethoscope },
  { name: 'General', icon: Stethoscope },
  { name: 'Cardiology', icon: Heart },
  { name: 'Pediatrics', icon: Baby },
  { name: 'Neurology', icon: Brain },
];

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.get('/api/doctors', { requireAuth: false });
        if (data.success) {
          setDoctors(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDocs = doctors.filter(doc => 
    (activeCat === 'All' || doc.specialization?.includes(activeCat)) &&
    doc.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Top Specialists</h1>
          <p className="text-gray-500 mt-1 font-medium">Connect with board-certified Ethiopian medical experts.</p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white border border-gray-100 px-6 py-4 rounded-[24px] flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, specialty, or hospital..."
              className="bg-transparent border-none outline-none text-sm font-medium w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-8 py-4 bg-gray-900 text-white rounded-[24px] font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-xl shadow-gray-900/10">
            <Filter size={20} /> Advanced Filter
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap
                ${activeCat === cat.name ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200'}
              `}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold tracking-tight">Accessing medical directory...</p>
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDocs.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all overflow-hidden group"
              >
                 <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                       <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl border-4 border-white shadow-sm">
                          {doc.full_name.charAt(0)}
                       </div>
                       <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-orange-400">
                             <Star size={14} fill="currentColor" />
                             <span className="text-xs font-black">4.9</span>
                          </div>
                           <span className="text-[10px] font-semibold text-gray-500 uppercase">Verified</span>
                       </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{doc.full_name}</h3>
                    <p className="text-sm font-bold text-emerald-600 mb-4">{doc.specialization || 'General Practitioner'}</p>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-3 text-gray-500">
                          <MapPin size={14} />
                          <span className="text-xs font-medium">Addis Ababa, Ethiopia</span>
                       </div>
                       <div className="flex items-center gap-3 text-gray-500">
                          <Calendar size={14} />
                          <span className="text-xs font-medium">Available Today</span>
                       </div>
                    </div>

                    <button 
                      onClick={() => navigate('/patient/appointments', { state: { openBooking: true, selectDoctorId: doc.id, selectDoctorName: doc.full_name, selectSpecialty: doc.specialization } })}
                      className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                       Book Consultation <ChevronRight size={16} />
                    </button>
                 </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Users size={40} />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">No Specialists Found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">We are currently verifying credentials for new doctors. Please use our AI Assistant for immediate triage.</p>
          </div>
        )}
      </div>

      {/* Quick Consult Banner */}
      <div className="bg-gray-900 p-12 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-10">
           <Globe size={200} />
         </div>
         <div className="relative z-10 text-center md:text-left">
           <h3 className="text-3xl font-black mb-2 tracking-tight">Can't find what you're looking for?</h3>
           <p className="text-gray-500 max-w-xl">Use our AI matchmaker to find the perfect specialist based on your symptoms and preferences.</p>
         </div>
         <button className="relative z-10 px-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-emerald-600/20">
           Ask Sheger AI
         </button>
      </div>
    </div>
  );
};

export default DoctorsPage;
