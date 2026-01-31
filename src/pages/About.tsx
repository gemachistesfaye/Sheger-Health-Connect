import { Link } from 'react-router-dom';
import { 
  Heart, 
  Target, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';

const About = () => {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-12 lg:py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            About Sheger Care Clinic
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Your trusted healthcare partner in Addis Ababa
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground">
                Sheger Care Clinic was established in 2018 with a simple mission: to provide 
                quality, affordable healthcare to the people of Addis Ababa. What started as 
                a small consultation room has grown into a full-service medical facility, 
                serving thousands of patients each year.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To deliver compassionate, patient-centered healthcare that is accessible 
                    to all members of our community, regardless of their economic background.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">Our Values</h3>
                  <p className="text-muted-foreground">
                    Integrity, compassion, excellence, and respect guide everything we do. 
                    We treat every patient as family and prioritize their well-being above all.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: '5,000+', label: 'Patients Served' },
              { value: '6+', label: 'Years of Service' },
              { value: '10+', label: 'Medical Staff' },
              { value: '98%', label: 'Patient Satisfaction' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose Sheger Care?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stand out through our commitment to excellence and patient care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Qualified Professionals',
                desc: 'Our team consists of experienced doctors, nurses, and medical technicians who are dedicated to providing the best care possible.',
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Affordable Care',
                desc: 'We believe quality healthcare should be accessible to everyone. Our pricing is transparent and competitive.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Community Trust',
                desc: 'Built on years of reliable service and positive outcomes, we have earned the trust of the Addis Ababa community.',
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our Commitment
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                'Provide timely and accurate diagnoses',
                'Maintain the highest standards of hygiene and safety',
                'Treat all patients with dignity and respect',
                'Continuously improve our services based on patient feedback',
                'Make healthcare affordable without compromising quality',
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Experience the Sheger Care Difference
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of satisfied patients who trust us with their health.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="xl" className="gap-2">
              Book an Appointment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
