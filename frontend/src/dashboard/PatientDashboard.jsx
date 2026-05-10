import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AIChat from '../components/AIChat';
import AppointmentBooking from '../components/AppointmentBooking';

const PatientDashboard = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch Appointments
      const appRes = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const appData = await appRes.json();
      if (appData.success) {
        setAppointmentCount(appData.data.length);
      }

      // Fetch Medical Records
      if (user) {
        const recRes = await fetch(`http://localhost:5000/api/records/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const recData = await recRes.json();
        if (recData.success) {
          setMedicalRecords(recData.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user]);

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
              <p className="text-3xl font-bold text-gray-800">{medicalRecords.length}</p>
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
              <AppointmentBooking onBookingSuccess={fetchData} />
            )}
            {activeTab === 'history' && (
              <div className="p-6">
                {medicalRecords.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">No historical medical records found.</div>
                ) : (
                  <div className="space-y-6">
                    {medicalRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-5 bg-slate-50">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                          <h4 className="font-bold text-primary">Visit ID: #{record.id}</h4>
                          <span className="text-sm text-muted-foreground">{new Date(record.visit_date).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong className="block text-gray-700 mb-1">Diagnosis:</strong>
                            <p className="text-gray-600 bg-white p-2 border rounded">{record.diagnosis}</p>
                          </div>
                          <div>
                            <strong className="block text-gray-700 mb-1">Prescriptions:</strong>
                            <p className="text-gray-600 bg-white p-2 border rounded">{record.prescriptions || 'None'}</p>
                          </div>
                          <div>
                            <strong className="block text-gray-700 mb-1">Lab Results:</strong>
                            <p className="text-gray-600 bg-white p-2 border rounded">{record.lab_results || 'None'}</p>
                          </div>
                          <div>
                            <strong className="block text-gray-700 mb-1">Allergies:</strong>
                            <p className="text-gray-600 bg-white p-2 border rounded">{record.allergies || 'None recorded'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
