import { Link } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  Stethoscope, 
  FlaskConical, 
  Baby, 
  Ambulance,
  CheckCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { services } from '@/data/mockData';

const iconMap: { [key: string]: React.ReactNode } = {
  stethoscope: <Stethoscope className="w-8 h-8" />,
  flask: <FlaskConical className="w-8 h-8" />,
  baby: <Baby className="w-8 h-8" />,
  ambulance: <Ambulance className="w-8 h-8" />,
};

const Home = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Trusted by 5,000+ patients
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Sheger Care Clinic – 
              <span className="text-gradient-hero block mt-2">Quality Healthcare You Can Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Providing compassionate and professional medical care to the Addis Ababa community. 
              Your health is our priority.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="xl" className="gap-2">
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="https://t.me/GemachisTesfaye" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="xl" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Telegram
                </Button>
              </a>
              <a href="tel:+251976601074">
                <Button variant="ghost" size="xl" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Working Hours Banner */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Working Hours:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              <span className="hidden md:block">|</span>
              <span>Sun: 9:00 AM - 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="group bg-card hover:shadow-card-hover transition-all duration-300 border-border/50"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {iconMap[service.icon]}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="text-sm font-medium text-primary">
                    {service.priceRange}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg" className="gap-2">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Sheger Care?
              </h2>
              <p className="text-muted-foreground mb-8">
                We are committed to providing exceptional healthcare services with a focus on 
                patient comfort, affordability, and quality care.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Qualified Professionals', desc: 'Experienced doctors and nurses dedicated to your health' },
                  { title: 'Affordable Care', desc: 'Quality medical services at prices you can afford' },
                  { title: 'Community Trust', desc: 'Serving the Addis Ababa community since 2018' },
                  { title: 'Modern Facilities', desc: 'Clean, well-equipped clinic with the latest medical technology' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-8 lg:p-12 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-4">Need Immediate Care?</h3>
              <p className="mb-6 opacity-90">
                Our clinic is open extended hours to serve you better. Don't hesitate to reach out for urgent medical needs.
              </p>
              <div className="space-y-4">
                <a 
                  href="tel:+251976601074" 
                  className="flex items-center gap-3 p-4 bg-background/10 rounded-xl hover:bg-background/20 transition-colors"
                >
                  <Phone className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Call Us Now</p>
                    <p className="font-semibold">+251 976 601 074</p>
                  </div>
                </a>
                <Link 
                  to="/contact"
                  className="flex items-center gap-3 p-4 bg-background/10 rounded-xl hover:bg-background/20 transition-colors"
                >
                  <ArrowRight className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Online Booking</p>
                    <p className="font-semibold">Book an Appointment</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Schedule an appointment today and experience quality healthcare that puts you first.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl" className="gap-2">
              Book Your Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
