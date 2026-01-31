import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { patients as initialPatients, Patient, services } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    phone: '',
    service: '',
    visitDate: new Date().toISOString().split('T')[0],
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: String(patient.age),
        gender: patient.gender,
        phone: patient.phone,
        service: patient.service,
        visitDate: patient.visitDate,
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        service: '',
        visitDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.age || !formData.phone || !formData.service) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingPatient) {
      setPatients(prev => prev.map(p => 
        p.id === editingPatient.id 
          ? { ...p, ...formData, age: Number(formData.age) }
          : p
      ));
      toast({ title: "Patient updated successfully" });
    } else {
      const newPatient: Patient = {
        id: String(Date.now()),
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        service: formData.service,
        visitDate: formData.visitDate,
        status: 'active',
      };
      setPatients(prev => [newPatient, ...prev]);
      toast({ title: "Patient added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    toast({ title: "Patient record deleted" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Patient Records
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage patient information and visit history
            </p>
          </div>
          <Button variant="hero" className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Patients ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead className="hidden sm:table-cell">Phone</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell className="hidden sm:table-cell">{patient.phone}</TableCell>
                      <TableCell>{patient.visitDate}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                          {patient.service}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(patient)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination (Demo) */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPatients.length} of {patients.length} patients
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v as 'Male' | 'Female' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select
                  value={formData.service}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, service: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Visit Date</label>
                <Input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="hero" onClick={handleSave}>
                {editingPatient ? 'Update' : 'Add'} Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Patients;
