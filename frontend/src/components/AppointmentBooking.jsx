import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Users,
  Search,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const departments = [
  { id: 'gen', name: 'General Consultation', icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'lab', name: 'Laboratory Services', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'mat', name: 'Maternal & Child Care', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'emg', name: 'Emergency Care', icon: HeartPulse, color: 'text-red-600', bg: 'bg-red-50' }
];

const doctors = [
  { id: '1', name: 'Dr. Samuel Kassa', specialty: 'General Physician', rating: 4.9 },
  { id: '2', name: 'Dr. Bethlehem Tadesse', specialty: 'Pediatrician', rating: 4.8 },
  { id: '3', name: 'Dr. Yonas Abebe', specialty: 'Cardiologist', rating: 5.0 }
];

const AppointmentBooking = ({ onBookingSuccess }) => {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        if (onBookingSuccess) onBookingSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Select Department</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setFormData({...formData, department: dept.name});
                    nextStep();
                  }}
                  className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 text-left group
                    ${formData.department === dept.name ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/20 bg-white shadow-sm'}
                  `}
                >
                  <div className={`p-3 rounded-2xl ${dept.bg} ${dept.color}`}>
                    <dept.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{dept.name}</p>
                    <p className="text-xs text-gray-500">Available Today</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Choose Specialist</h3>
            <div className="space-y-4">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setFormData({...formData, doctor_id: doc.id});
                    nextStep();
                  }}
                  className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left
                    ${formData.doctor_id === doc.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/20 bg-white'}
                  `}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
                      ★ <span>{doc.rating}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">120+ Reviews</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={prevStep} className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1">
              <ChevronLeft size={16} /> Back to Departments
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900">Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium"
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, appointment_time: t})}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all
                        ${formData.appointment_time === t ? 'border-primary bg-primary text-white' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-primary/30'}
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!formData.appointment_date || !formData.appointment_time}
                className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Review Booking
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900 text-center">Confirm Your Visit</h3>
            <div className="bg-gray-50 p-8 rounded-[32px] border border-dashed border-gray-200 space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Specialist</span>
                <span className="font-bold text-gray-900">{doctors.find(d => d.id === formData.doctor_id)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Department</span>
                <span className="font-bold text-gray-900">{formData.department}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500 font-medium">Date & Time</span>
                <span className="font-bold text-gray-900">{formData.appointment_date} @ {formData.appointment_time}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Visit (Optional)</label>
                <textarea 
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  rows="3"
                  placeholder="Tell us a bit about your symptoms..."
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirm Appointment'}
            </button>
            <button onClick={prevStep} className="w-full text-sm font-bold text-gray-400 hover:text-primary transition-colors">
              Make Changes
            </button>
          </motion.div>
        );
      default: return null;
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 px-6">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">
          Your appointment request has been received. We will notify you once the doctor confirms your visit.
        </p>
        <button 
          onClick={() => setStep(1) || setSuccess(false)}
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded-[40px] shadow-sm border border-gray-100">
      {/* Progress Tracker */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step === s ? 'bg-primary text-white shadow-lg' : step > s ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}
            `}>
              {step > s ? '✓' : s}
            </div>
            {s !== 4 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > s ? 'bg-emerald-100' : 'bg-gray-50'}`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="p-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentBooking;
