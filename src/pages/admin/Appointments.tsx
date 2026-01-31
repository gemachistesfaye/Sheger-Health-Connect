import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { appointments as initialAppointments, Appointment, services } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesService = serviceFilter === 'all' || apt.service === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  const updateStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast({ 
      title: `Appointment ${newStatus}`,
      description: `Status updated successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-medical-yellow/20 text-medical-yellow border-medical-yellow/30">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-medical-green/20 text-medical-green border-medical-green/30">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Completed</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Appointment Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage patient appointment requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-medical-yellow/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-medical-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-medical-green/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-medical-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedCount}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Appointments ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredAppointments.map((apt) => (
                <div 
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/50 bg-card gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">{apt.patientName}</p>
                      {getStatusBadge(apt.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {apt.service} • {apt.date} at {apt.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📞 {apt.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {apt.status === 'pending' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => updateStatus(apt.id, 'confirmed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {apt.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateStatus(apt.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No appointments found matching your filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Appointment Details</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Patient Name</span>
                  <span className="font-medium">{selectedAppointment.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{selectedAppointment.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{selectedAppointment.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedAppointment.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                {selectedAppointment.message && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Message:</p>
                    <p className="text-sm bg-secondary/50 p-3 rounded-lg">
                      {selectedAppointment.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Appointments;
