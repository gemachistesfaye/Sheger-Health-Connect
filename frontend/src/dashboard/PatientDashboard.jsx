import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AIChat from '../components/AIChat';
import AppointmentBooking from '../components/AppointmentBooking';

const PatientDashboard = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointmentCount, setAppointmentCount] = useState(0);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointmentCount(data.data.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top Navbar */}
      <nav className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Sheger Health Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm hidden md:inline">Welcome, {user?.full_name}</span>
          <button 
            onClick={logout}
            className="bg-white/20 px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-primary">
              <h3 className="font-bold text-gray-500 text-sm mb-1">My Appointments</h3>
              <p className="text-3xl font-bold text-gray-800">{appointmentCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
              <h3 className="font-bold text-gray-500 text-sm mb-1">Medical Records</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-4 font-medium text-sm transition-colors ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Book Appointment
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-4 font-medium text-sm transition-colors ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My History
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm min-h-[400px]">
            {activeTab === 'overview' && (
              <AppointmentBooking onBookingSuccess={fetchAppointments} />
            )}
            {activeTab === 'history' && (
              <div className="p-6 text-center text-gray-500">
                <p>No historical medical records found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Assistant */}
        <div className="w-full md:w-[380px] lg:w-[420px]">
          <AIChat />
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
