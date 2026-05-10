const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Sheger Care Clinic</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Providing compassionate and professional medical care to the Addis Ababa community. Your health is our priority.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90">
              Book Appointment
            </button>
            <button className="bg-white text-primary border border-primary px-6 py-3 rounded-md font-medium hover:bg-primary/5">
              Call Now: +251 976 601 074
            </button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl shadow-sm bg-card hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">General Consultation</h3>
              <p className="text-muted-foreground">Comprehensive medical consultations with experienced physicians.</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-card hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Laboratory Services</h3>
              <p className="text-muted-foreground">State-of-the-art diagnostic laboratory offering accurate test results.</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm bg-card hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2">Emergency Care</h3>
              <p className="text-muted-foreground">Prompt medical attention for urgent health concerns and injuries.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
