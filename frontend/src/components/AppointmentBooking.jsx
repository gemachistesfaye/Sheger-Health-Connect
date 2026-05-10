import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AppointmentBooking = ({ onBookingSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    doctor_id: '1', // Defaulting for stub, ideally fetched from a /doctors endpoint
    department: 'General Consultation',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('✅ Appointment requested successfully!');
        setFormData({ ...formData, notes: '' }); // reset notes
        if (onBookingSuccess) onBookingSuccess();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Network error processing request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Book New Appointment</h2>
      
      {message && (
        <div className={`p-3 rounded-md text-sm mb-4 font-medium ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select 
            name="department" 
            value={formData.department} 
            onChange={handleChange}
            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="General Consultation">General Consultation</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Maternal & Child Care">Maternal & Child Care</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input 
              type="date" 
              name="appointment_date"
              required
              value={formData.appointment_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input 
              type="time" 
              name="appointment_time"
              required
              value={formData.appointment_time}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea 
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Describe your primary reason for the visit..."
            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
