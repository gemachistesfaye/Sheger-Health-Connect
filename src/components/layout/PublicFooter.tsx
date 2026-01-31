import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Sheger Care</h3>
                <p className="text-xs text-muted-foreground">Clinic</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Quality healthcare you can trust. Providing compassionate medical care to the Addis Ababa community since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <span>+251 976 601 074</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <span>info@shegercare.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>Bole Sub City, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                  <p>Sun: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h4 className="font-display font-semibold mb-4">Developer</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Gemachis Tesfaye</p>
              <a 
                href="mailto:gemachistesfaye36@gmail.com"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="w-3 h-3" />
                gemachistesfaye36@gmail.com
              </a>
              <a 
                href="tel:+251976601074"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="w-3 h-3" />
                +251 976 601 074
              </a>
              <a 
                href="https://github.com/gemachistesfaye"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                GitHub
              </a>
              <a 
                href="https://t.me/GemachisTesfaye"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sheger Care Clinic. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Developed by Gemachis Tesfaye
          </p>
        </div>
      </div>
    </footer>
  );
};
