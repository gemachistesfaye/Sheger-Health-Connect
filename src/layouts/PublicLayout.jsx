import { Outlet, Link } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">Sheger Care</Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link to="/services" className="text-sm font-medium hover:text-primary">Services</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          </nav>
          <div className="flex gap-4">
            <Link to="/contact" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Book Appointment</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-secondary py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sheger Care Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
