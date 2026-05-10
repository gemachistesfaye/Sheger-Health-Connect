import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [recordData, setRecordData] = useState({
    diagnosis: '',
    prescriptions: '',
    allergies: '',
    lab_results: '',
    notes: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setAppointments(data.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAppointments();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...recordData,
          patient_id: selectedAppointment.patient_id,
          appointment_id: selectedAppointment.id
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Medical record created successfully! Appointment marked as Completed.');
        setAppointments(appointments.map(app => app.id === selectedAppointment.id ? { ...app, status: 'Completed' } : app));
        setSelectedAppointment(null);
        setRecordData({ diagnosis: '', prescriptions: '', allergies: '', lab_results: '', notes: '' });
      }
    } catch (error) {
      console.error(error);
      alert('Error creating record');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 relative">
      <nav className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Doctor Workspace</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm hidden md:inline">Dr. {user?.full_name}</span>
          <button onClick={logout} className="bg-white/20 px-3 py-1.5 rounded-md text-sm hover:bg-white/30">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="text-2xl font-bold mb-6">Today's Schedule</h2>
          
          {appointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No appointments scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 text-sm font-semibold text-gray-600">Patient ID</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Time</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-slate-50 transition">
                      <td className="p-3 text-sm">#{app.patient_id}</td>
                      <td className="p-3 text-sm">{app.appointment_date}</td>
                      <td className="p-3 text-sm">{app.appointment_time}</td>
                      <td className="p-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm flex gap-2">
                        {app.status === 'Pending' && (
                          <button onClick={() => updateStatus(app.id, 'Confirmed')} className="text-green-600 hover:text-green-800 text-xs font-medium bg-green-50 px-2 py-1 rounded">Confirm</button>
                        )}
                        {(app.status === 'Confirmed') && (
                          <button onClick={() => setSelectedAppointment(app)} className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded">Write Record</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Medical Record Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Create Medical Record</h2>
            <p className="text-sm text-muted-foreground mb-6">Patient ID: {selectedAppointment.patient_id} | Appointment: {selectedAppointment.appointment_date}</p>
            
            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis (Required)</label>
                <textarea required className="w-full border rounded p-2 text-sm" rows="3" value={recordData.diagnosis} onChange={e => setRecordData({...recordData, diagnosis: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prescriptions</label>
                <textarea className="w-full border rounded p-2 text-sm" rows="2" value={recordData.prescriptions} onChange={e => setRecordData({...recordData, prescriptions: e.target.value})} placeholder="Medication, Dosage, Frequency..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lab Results / Orders</label>
                  <textarea className="w-full border rounded p-2 text-sm" rows="2" value={recordData.lab_results} onChange={e => setRecordData({...recordData, lab_results: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Allergies</label>
                  <textarea className="w-full border rounded p-2 text-sm" rows="2" value={recordData.allergies} onChange={e => setRecordData({...recordData, allergies: e.target.value})}></textarea>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button type="button" onClick={() => setSelectedAppointment(null)} className="px-4 py-2 border rounded font-medium text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-medium text-sm hover:bg-primary/90">Save & Complete Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
