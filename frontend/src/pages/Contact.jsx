import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  Globe,
  Activity,
  ArrowUpRight
} from 'lucide-react';

const ContactInfoCard = ({ icon: Icon, title, info, subinfo, color }) => (
  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-6 group hover:shadow-2xl hover:shadow-emerald-600/5 transition-all">
    <div className={`w-14 h-14 rounded-2xl ${color} bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <h4 className="text-xl font-black text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-900 font-bold mb-1">{info}</p>
      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{subinfo}</p>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="container mx-auto px-6 mb-24 text-center">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter"
         >
           Get in <span className="text-emerald-600">Touch.</span>
         </motion.h1>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-lg text-gray-500 max-w-2xl mx-auto font-medium"
         >
           Whether you're a patient, a doctor, or an organization—we're here to help you navigate the future of healthcare.
         </motion.p>
      </section>

      <section className="container mx-auto px-6 mb-32">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Contact Form */}
            <div className="lg:col-span-2 bg-gray-900 p-10 lg:p-20 rounded-[60px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 opacity-5">
                  <MessageSquare size={300} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-12 tracking-tight">Send a Message</h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Full Name</label>
                        <input type="text" placeholder="Abebe Bekele" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-emerald-500 transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Email Address</label>
                        <input type="email" placeholder="abebe@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-emerald-500 transition-all" />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Your Message</label>
                        <textarea placeholder="How can we help you?" className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-emerald-500 transition-all resize-none" />
                     </div>
                     <div className="md:col-span-2">
                        <button className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform flex items-center justify-center gap-3">
                           Send Message <Send size={20} />
                        </button>
                     </div>
                  </form>
               </div>
            </div>

            {/* Right: Info Cards */}
            <div className="space-y-8">
               <ContactInfoCard 
                 icon={Phone} 
                 title="Call Center" 
                 info="+251 11 000 0000" 
                 subinfo="Available 24/7" 
                 color="text-emerald-600"
               />
               <ContactInfoCard 
                 icon={Mail} 
                 title="General Inquiry" 
                 info="hello@sheger.care" 
                 subinfo="Average response: 2 hours" 
                 color="text-blue-600"
               />
               <ContactInfoCard 
                 icon={MapPin} 
                 title="Headquarters" 
                 info="Bole, Addis Ababa" 
                 subinfo="Ethiopia" 
                 color="text-purple-600"
               />
               
               {/* Quick Support Card */}
               <div className="bg-emerald-600 p-10 rounded-[40px] text-white shadow-xl shadow-emerald-600/20 group cursor-pointer">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Clock size={24} />
                     </div>
                     <ArrowUpRight size={24} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Live Support</h4>
                  <p className="text-sm text-emerald-100 font-medium leading-relaxed">Chat with our patient success team in real-time.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Emergency Map Concept */}
      <section className="container mx-auto px-6 mb-24">
         <div className="w-full h-96 bg-gray-100 rounded-[60px] relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000">
               {/* Mock Map Texture */}
               <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white" />
            </div>
            <div className="relative z-10 text-center">
               <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-red-500/50 mb-4 mx-auto">
                  <MapPin size={32} />
               </div>
               <p className="font-black text-gray-900 text-xl">Our Main Hub</p>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bole Atlas, Addis Ababa</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Contact;
