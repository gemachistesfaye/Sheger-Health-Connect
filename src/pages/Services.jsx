const servicesList = [
  {
    title: "General Consultation",
    price: "300 - 500 ETB",
    description: "Comprehensive medical consultations with experienced physicians for diagnosis and treatment of common ailments, chronic conditions, and preventive care.",
    duration: "30 mins",
    availability: "Mon-Sun"
  },
  {
    title: "Laboratory Services",
    price: "150 - 2,000 ETB",
    description: "State-of-the-art diagnostic laboratory offering accurate and timely test results for blood work, urinalysis, and other essential tests.",
    duration: "Varies",
    availability: "Mon-Sat"
  },
  {
    title: "Maternal & Child Care",
    price: "400 - 800 ETB",
    description: "Dedicated care for mothers and children including prenatal checkups, postnatal care, vaccinations, and pediatric consultations.",
    duration: "45 mins",
    availability: "Mon-Fri"
  },
  {
    title: "Emergency Care",
    price: "500 - 1,500 ETB",
    description: "Prompt medical attention for urgent health concerns and minor injuries. Available during extended hours.",
    duration: "Immediate",
    availability: "24/7"
  }
];

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Medical Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {servicesList.map((svc, idx) => (
          <div key={idx} className="border p-6 rounded-xl bg-card shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-primary">{svc.title}</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{svc.price}</span>
            </div>
            <p className="text-muted-foreground mb-4">{svc.description}</p>
            <div className="flex gap-4 text-sm font-medium text-secondary-foreground">
              <span>⏱ {svc.duration}</span>
              <span>📅 {svc.availability}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
