import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/30 p-8">
      <div className="max-w-4xl mx-auto bg-card p-8 rounded-2xl shadow-sm border">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.full_name}</p>
          </div>
          <button 
            onClick={logout}
            className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg font-medium hover:bg-destructive hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">My Appointments</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
          <div className="border p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Medical Records</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
          <div className="border p-6 rounded-xl bg-primary/5 border-primary/20">
            <h3 className="font-bold text-lg mb-2 text-primary">AI Health Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">Chat with our AI for immediate health guidance.</p>
            <button className="bg-primary text-white w-full py-2 rounded-md font-medium text-sm hover:bg-primary/90">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
