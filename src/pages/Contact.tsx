import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/data/mockData';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Name and phone number are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Appointment Request Sent!",
      description: "We will contact you shortly to confirm your appointment.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-12 lg:py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Book an appointment or get in touch with our team
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Get In Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                We're here to help. Reach out to us through any of the following channels 
                or fill out the appointment form.
              </p>

              <div className="space-y-4 mb-8">
                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <a href="tel:+251976601074" className="text-primary hover:underline">
                        +251 976 601 074
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <a href="mailto:info@shegercare.com" className="text-primary hover:underline">
                        info@shegercare.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-muted-foreground">
                        Bole Sub City, Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Working Hours</h4>
                      <p className="text-muted-foreground text-sm">
                        Mon - Sat: 8:00 AM - 8:00 PM<br />
                        Sun: 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://t.me/GemachisTesfaye" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Telegram
                  </Button>
                </a>
                <a href="tel:+251976601074" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
              </div>

              {/* Google Maps */}
              <div className="mt-8 rounded-xl overflow-hidden border border-border/50 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126766.39636366508!2d38.69108339453125!3d9.010793200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1706540000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sheger Care Clinic Location"
                />
              </div>
            </div>

            {/* Appointment Form */}
            <div>
              <Card className="border-border/50">
                <CardContent className="p-6 lg:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold mb-2">
                        Request Submitted!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for your appointment request. We will contact you within 24 hours to confirm.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', phone: '', service: '', message: '' });
                        }}
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-xl font-semibold mb-2">
                        Book an Appointment
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Fill out the form below and we'll get back to you shortly.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Full Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            maxLength={100}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone Number <span className="text-destructive">*</span>
                          </label>
                          <Input
                            type="tel"
                            placeholder="+251 9XX XXX XXX"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                            maxLength={20}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Service Needed
                          </label>
                          <Select
                            value={formData.service}
                            onValueChange={(value) => handleInputChange('service', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map(service => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.title}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">Other / Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Message (Optional)
                          </label>
                          <Textarea
                            placeholder="Tell us more about your symptoms or concerns..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            rows={4}
                            maxLength={1000}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero" 
                          size="lg" 
                          className="w-full gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Submitting...</>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Appointment Request
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
