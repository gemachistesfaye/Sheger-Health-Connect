import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-shadow">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-foreground">Sheger Care</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Clinic</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <a href="tel:+251976601074">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="hero" size="sm">
                Book Appointment
              </Button>
            </Link>
            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors ml-2">
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 ${
                    location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <a href="tel:+251976601074" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
                <Link to="/contact" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Book Appointment
                  </Button>
                </Link>
                <Link 
                  to="/admin/login" 
                  className="text-sm text-center text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Staff Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
