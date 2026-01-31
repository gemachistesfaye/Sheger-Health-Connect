import { 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { dailyPatientStats, serviceDistribution, appointments, patients } from '@/data/mockData';

const Dashboard = () => {
  const todayAppointments = appointments.filter(a => a.status !== 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const totalPatients = patients.length;
  const activeServices = 4;

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Appointments Today',
      value: todayAppointments,
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-medical-coral/10 text-medical-coral',
    },
    {
      title: 'Pending Requests',
      value: pendingAppointments,
      change: 'Needs attention',
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-medical-yellow/10 text-medical-yellow',
    },
    {
      title: 'Active Services',
      value: activeServices,
      change: 'All operational',
      changeType: 'positive',
      icon: Stethoscope,
      color: 'bg-medical-green/10 text-medical-green',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening at Sheger Care Clinic.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.changeType === 'positive' ? 'text-medical-green' : 
                      stat.changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {stat.changeType === 'positive' && <ArrowUp className="w-3 h-3" />}
                      {stat.changeType === 'negative' && <ArrowDown className="w-3 h-3" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Patients Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Daily Patient Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPatientStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="patients" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Service Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => <span className="text-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Appointment Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt) => (
                <div 
                  key={apt.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <div className="flex-1">
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.service} • {apt.date} at {apt.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'pending' 
                      ? 'bg-medical-yellow/20 text-medical-yellow' 
                      : apt.status === 'confirmed'
                      ? 'bg-medical-green/20 text-medical-green'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
