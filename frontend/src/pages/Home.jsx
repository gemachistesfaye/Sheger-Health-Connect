import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Activity, 
  Heart, 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Smartphone,
  Star,
  Zap,
  Globe
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="hero-gradient pt-32 pb-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-100/50 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px]"
        />

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6"
            >
              <Sparkles size={16} />
              <span>Next-Gen Healthcare is Here</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6 tracking-tighter"
            >
              Healthcare <br />
              <span className="text-gradient">Redefined.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed"
            >
              Sheger Health Connect combines cutting-edge AI technology with compassionate Ethiopian medical expertise to deliver a premium telemedicine experience.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link to="/register" className="btn-premium w-full sm:w-auto text-center">
                Get Started Free
              </Link>
              <Link to="/about" className="px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2">
                Explore Technology <ChevronRight size={20} />
              </Link>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <p className="text-sm text-gray-400 font-medium">
                <span className="text-gray-900 font-bold">10k+</span> Trusted Patients in Ethiopia
              </p>
            </motion.div>
          </div>

          <div className="flex-1 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 z-20 glass-card p-6 flex items-center gap-4 floating"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold">Heart Rate</p>
                  <p className="text-xl font-bold text-gray-900">72 BPM</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 z-20 glass-card p-6 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold">Health Score</p>
                  <p className="text-xl font-bold text-gray-900">98%</p>
                </div>
              </motion.div>

              {/* Hero Image / Graphic */}
              <div className="w-full h-[500px] bg-gradient-to-br from-emerald-100 to-blue-100 rounded-[60px] overflow-hidden border-8 border-white shadow-2xl relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Stethoscope size={200} className="text-emerald-500/20" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-emerald-600/20 to-transparent">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                    <p className="text-white font-bold text-sm">Empowering Ethiopia through Digital Health</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 tracking-tight">Our Modern Healthcare Ecosystem</h2>
            <p className="text-gray-500 text-base">We've built a complete digital clinic that follows you wherever you go.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI-Powered Diagnosis", desc: "Instant symptom checking using advanced medical AI trained for local needs.", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
              { title: "24/7 Telemedicine", desc: "Connect with top Ethiopian doctors within minutes from the comfort of your home.", icon: PhoneCall, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Digital Records", desc: "Your entire medical history, prescriptions, and lab results in one secure cloud.", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-50" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[40px] border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-2xl hover:shadow-emerald-600/5 transition-all group"
              >
                <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <s.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI ASSISTANT PREVIEW */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight tracking-tighter">Meet Sheger AI. <br /><span className="text-emerald-400">Your First Point of Care.</span></h2>
            <div className="space-y-6">
              {[
                "Symptom checking in Amharic & Afaan Oromo",
                "Instant department recommendations",
                "Emergency warning system",
                "Personalized health insights"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Zap size={12} fill="white" />
                  </div>
                  <span className="text-lg text-gray-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
            <button className="mt-12 btn-premium">Try AI Assistant</button>
          </div>
          <div className="flex-1 w-full max-w-xl">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <p className="font-bold">Sheger AI Assistant</p>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Active Now</p>
                  </div>
               </div>
               <div className="space-y-4 mb-8">
                  <div className="bg-white/10 rounded-2xl p-4 rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Hello! I can help you check your symptoms. What are you feeling today?</p>
                  </div>
                  <div className="bg-emerald-500 rounded-2xl p-4 rounded-tr-none max-w-[80%] ml-auto">
                    <p className="text-sm">I have a persistent headache and feel a bit dizzy.</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Based on your input, this could be related to dehydration or stress. I recommend seeing a General Physician.</p>
                  </div>
               </div>
               <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                 <span className="text-gray-400 text-sm">Type your message...</span>
                 <Zap size={20} className="text-emerald-500" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOCTOR SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Top-Rated Specialists</h2>
              <p className="text-gray-500 text-base font-medium">Access over 500+ board-certified doctors across Ethiopia.</p>
            </div>
            <button className="px-8 py-4 bg-gray-50 rounded-2xl font-bold text-emerald-600 hover:bg-emerald-50 transition-all">View All Doctors</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-4 py-20 bg-gray-50 rounded-[40px] text-center border-2 border-dashed border-gray-200">
               <Users size={48} className="mx-auto text-gray-300 mb-4" />
               <h4 className="text-xl font-bold text-gray-900 mb-2">No Doctors Onboarded Yet</h4>
               <p className="text-gray-400 text-sm max-w-sm mx-auto">We are currently verifying our medical specialists. Please check back shortly to book your first consultation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EMERGENCY BANNER */}
      <section className="container mx-auto px-6 mb-24">
        <div className="bg-red-500 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-red-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <PhoneCall size={200} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black mb-4">Medical Emergency?</h2>
            <p className="text-lg text-white/80 max-w-xl">Get immediate assistance and department routing. Our emergency team is available 24/7.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <a href="tel:8282" className="bg-white text-red-500 px-10 py-5 rounded-[24px] font-black text-xl hover:scale-105 transition-all shadow-xl">Call 8282</a>
            <button className="bg-red-600 text-white px-10 py-5 rounded-[24px] font-bold border border-white/20 hover:bg-red-700 transition-all">Check Symptoms</button>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Loved by Ethiopians</h2>
            <p className="text-gray-500 font-medium">Real stories from our healthy community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm">
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic mb-8 leading-relaxed">
                  "Sheger Health changed the way my family accesses healthcare. I was able to talk to a specialist from my home in Bahir Dar within 20 minutes."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Dawit Solomon</p>
                    <p className="text-xs text-gray-400">Addis Ababa, Ethiopia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
