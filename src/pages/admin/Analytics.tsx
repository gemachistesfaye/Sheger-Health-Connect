import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Calendar
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { monthlyPatientStats, serviceDistribution, dailyPatientStats } from '@/data/mockData';

const Analytics = () => {
  const weeklyGrowth = [
    { week: 'Week 1', patients: 45, revenue: 12500 },
    { week: 'Week 2', patients: 52, revenue: 14800 },
    { week: 'Week 3', patients: 48, revenue: 13200 },
    { week: 'Week 4', patients: 61, revenue: 17500 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Track clinic performance and patient trends
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'This Month', value: '285', change: '+15%', icon: Users, color: 'bg-primary/10 text-primary' },
            { label: 'Last Month', value: '248', change: '', icon: Calendar, color: 'bg-medical-blue/10 text-medical-blue' },
            { label: 'Avg. Daily', value: '14', change: '+2', icon: TrendingUp, color: 'bg-medical-green/10 text-medical-green' },
            { label: 'Peak Day', value: 'Sat', change: '25 visits', icon: BarChart3, color: 'bg-medical-coral/10 text-medical-coral' },
          ].map((stat, idx) => (
            <Card key={idx} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.change && (
                    <p className="text-xs text-medical-green">{stat.change}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Patient Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPatientStats}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorPatients)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
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
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value) => <span className="text-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Visits */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Daily Visits This Week
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
                      fill="hsl(var(--medical-coral))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Busiest Day', desc: 'Saturday has the highest patient volume with an average of 25 visits.' },
                { title: 'Top Service', desc: 'General Consultation accounts for 35% of all patient visits.' },
                { title: 'Growth Trend', desc: 'Patient visits increased by 15% compared to last month.' },
              ].map((insight, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
