// Mock data for demo purposes

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  visitDate: string;
  service: string;
  status: 'active' | 'completed';
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
  message?: string;
}

export const patients: Patient[] = [
  { id: '1', name: 'Abebe Bekele', age: 35, gender: 'Male', phone: '+251911234567', visitDate: '2024-01-28', service: 'General Consultation', status: 'completed' },
  { id: '2', name: 'Tigist Haile', age: 28, gender: 'Female', phone: '+251922345678', visitDate: '2024-01-28', service: 'Maternal Care', status: 'active' },
  { id: '3', name: 'Dawit Tesfaye', age: 42, gender: 'Male', phone: '+251933456789', visitDate: '2024-01-27', service: 'Laboratory Services', status: 'completed' },
  { id: '4', name: 'Sara Mengistu', age: 31, gender: 'Female', phone: '+251944567890', visitDate: '2024-01-27', service: 'Child Care', status: 'completed' },
  { id: '5', name: 'Yohannes Girma', age: 55, gender: 'Male', phone: '+251955678901', visitDate: '2024-01-26', service: 'General Consultation', status: 'completed' },
  { id: '6', name: 'Hana Solomon', age: 24, gender: 'Female', phone: '+251966789012', visitDate: '2024-01-26', service: 'Laboratory Services', status: 'completed' },
  { id: '7', name: 'Meron Tadesse', age: 38, gender: 'Female', phone: '+251977890123', visitDate: '2024-01-25', service: 'Maternal Care', status: 'completed' },
  { id: '8', name: 'Kiros Alemayehu', age: 47, gender: 'Male', phone: '+251988901234', visitDate: '2024-01-25', service: 'Emergency Care', status: 'completed' },
];

export const appointments: Appointment[] = [
  { id: '1', patientName: 'Aster Gebremariam', phone: '+251911111111', service: 'General Consultation', date: '2024-01-29', time: '09:00', status: 'pending', message: 'First time visit' },
  { id: '2', patientName: 'Bereket Hailu', phone: '+251922222222', service: 'Laboratory Services', date: '2024-01-29', time: '10:30', status: 'confirmed' },
  { id: '3', patientName: 'Chaltu Worku', phone: '+251933333333', service: 'Maternal Care', date: '2024-01-29', time: '14:00', status: 'pending', message: 'Monthly checkup' },
  { id: '4', patientName: 'Daniel Assefa', phone: '+251944444444', service: 'Child Care', date: '2024-01-30', time: '11:00', status: 'confirmed' },
  { id: '5', patientName: 'Eden Mulugeta', phone: '+251955555555', service: 'General Consultation', date: '2024-01-30', time: '15:30', status: 'pending' },
];

export const dailyPatientStats = [
  { date: 'Mon', patients: 12 },
  { date: 'Tue', patients: 15 },
  { date: 'Wed', patients: 18 },
  { date: 'Thu', patients: 14 },
  { date: 'Fri', patients: 22 },
  { date: 'Sat', patients: 25 },
  { date: 'Sun', patients: 10 },
];

export const monthlyPatientStats = [
  { month: 'Aug', patients: 180 },
  { month: 'Sep', patients: 220 },
  { month: 'Oct', patients: 195 },
  { month: 'Nov', patients: 260 },
  { month: 'Dec', patients: 310 },
  { month: 'Jan', patients: 285 },
];

export const serviceDistribution = [
  { name: 'General Consultation', value: 35, color: 'hsl(168, 76%, 36%)' },
  { name: 'Laboratory Services', value: 25, color: 'hsl(210, 80%, 55%)' },
  { name: 'Maternal & Child Care', value: 20, color: 'hsl(15, 85%, 57%)' },
  { name: 'Emergency Care', value: 12, color: 'hsl(150, 60%, 45%)' },
  { name: 'Other Services', value: 8, color: 'hsl(270, 60%, 55%)' },
];

export const services = [
  {
    id: 'general',
    title: 'General Consultation',
    description: 'Comprehensive medical consultations with experienced physicians for diagnosis and treatment of common ailments, chronic conditions, and preventive care.',
    icon: 'stethoscope',
    priceRange: '300 - 500 ETB',
    features: ['Physical examination', 'Health assessment', 'Prescription services', 'Follow-up care'],
  },
  {
    id: 'laboratory',
    title: 'Laboratory Services',
    description: 'State-of-the-art diagnostic laboratory offering accurate and timely test results for blood work, urinalysis, and other essential medical tests.',
    icon: 'flask',
    priceRange: '150 - 2,000 ETB',
    features: ['Blood tests', 'Urinalysis', 'Rapid testing', 'Same-day results'],
  },
  {
    id: 'maternal',
    title: 'Maternal & Child Care',
    description: 'Dedicated care for mothers and children including prenatal checkups, postnatal care, vaccinations, and pediatric consultations.',
    icon: 'baby',
    priceRange: '400 - 800 ETB',
    features: ['Prenatal care', 'Postnatal checkups', 'Vaccinations', 'Growth monitoring'],
  },
  {
    id: 'emergency',
    title: 'Emergency & Outpatient Care',
    description: 'Prompt medical attention for urgent health concerns and injuries. Available during extended hours for your convenience.',
    icon: 'ambulance',
    priceRange: '500 - 1,500 ETB',
    features: ['Urgent care', 'Minor injuries', 'First aid', 'Referral services'],
  },
];
