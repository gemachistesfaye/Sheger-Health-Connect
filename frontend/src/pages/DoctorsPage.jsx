import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Filter, 
  MessageSquare,
  Globe,
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Users
} from 'lucide-react';

const categories = [
  { name: 'All', icon: Stethoscope },
  { name: 'General', icon: Stethoscope },
  { name: 'Cardiology', icon: Heart },
  { name: 'Pediatrics', icon: Baby },
  { name: 'Neurology', icon: Brain },
];

const doctors = [];

const DoctorsPage = () => {
  const [activeCat, setActiveCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = doctors.filter(doc => 
    (activeCat === 'All' || doc.spec.includes(activeCat)) &&
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Top Specialists</h1>
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
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDocs.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/5 transition-all overflow-hidden group"
              >
                {/* ... existing card code ... */}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Users size={40} />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-2">No Specialists Found</h3>
             <p className="text-gray-400 text-sm max-w-sm mx-auto">We are currently verifying credentials for new doctors. Please use our AI Assistant for immediate triage.</p>
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
           <p className="text-gray-400 max-w-xl">Use our AI matchmaker to find the perfect specialist based on your symptoms and preferences.</p>
         </div>
         <button className="relative z-10 px-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-emerald-600/20">
           Ask Sheger AI
         </button>
      </div>
    </div>
  );
};

export default DoctorsPage;
