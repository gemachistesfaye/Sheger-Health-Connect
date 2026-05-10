const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">About Sheger Care Clinic</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sheger Care Clinic was established in 2018 with a simple mission: to provide quality, affordable healthcare to the people of Addis Ababa. We believe that access to excellent medical care is a fundamental right.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To be the leading healthcare provider in Ethiopia, known for patient-centered care, innovation, and community trust.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Integrity:</strong> Honest and transparent healthcare.</li>
            <li><strong>Compassion:</strong> Treating every patient like family.</li>
            <li><strong>Excellence:</strong> The highest standards in medical practice.</li>
            <li><strong>Respect:</strong> Valuing the dignity of every individual.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
