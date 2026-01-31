import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  FlaskConical, 
  Baby, 
  Ambulance,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { services } from '@/data/mockData';

const iconMap: { [key: string]: React.ReactNode } = {
  stethoscope: <Stethoscope className="w-10 h-10" />,
  flask: <FlaskConical className="w-10 h-10" />,
  baby: <Baby className="w-10 h-10" />,
  ambulance: <Ambulance className="w-10 h-10" />,
};

const Services = () => {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="py-12 lg:py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Medical Services
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Comprehensive healthcare solutions tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {services.map((service, idx) => (
              <Card 
                key={service.id} 
                className={`overflow-hidden border-border/50 ${
                  idx % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="lg:flex">
                  <div className={`lg:w-1/3 bg-gradient-hero p-8 lg:p-12 flex items-center justify-center ${
                    idx % 2 !== 0 ? 'lg:order-2' : ''
                  }`}>
                    <div className="w-24 h-24 rounded-2xl bg-background/20 flex items-center justify-center text-primary-foreground">
                      {iconMap[service.icon]}
                    </div>
                  </div>
                  <div className={`lg:w-2/3 p-8 lg:p-12 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="font-display text-2xl lg:text-3xl">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">What's Included:</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {service.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="px-4 py-2 bg-primary/10 rounded-lg">
                          <span className="text-sm text-muted-foreground">Price Range:</span>
                          <span className="ml-2 font-semibold text-primary">{service.priceRange}</span>
                        </div>
                        <Link to="/contact">
                          <Button variant="hero" className="gap-2">
                            Book This Service
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Not Sure What Service You Need?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us for a general consultation. Our experienced medical team will assess 
              your condition and recommend the best course of treatment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg" className="gap-2">
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="tel:+251976601074">
                <Button variant="outline" size="lg">
                  Call +251 976 601 074
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Services;
