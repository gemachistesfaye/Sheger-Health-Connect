const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-6 text-muted-foreground">
            <div>
              <strong className="block text-foreground">📍 Location</strong>
              Addis Ababa, Ethiopia
            </div>
            <div>
              <strong className="block text-foreground">📞 Phone</strong>
              +251 976 601 074
            </div>
            <div>
              <strong className="block text-foreground">💬 Telegram</strong>
              <a href="https://t.me/GemachisTesfaye" className="text-primary hover:underline" target="_blank" rel="noreferrer">@GemachisTesfaye</a>
            </div>
            <div>
              <strong className="block text-foreground">🕒 Working Hours</strong>
              Mon-Sat: 8:00 AM - 8:00 PM<br/>
              Sun: 9:00 AM - 5:00 PM
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-4 border p-6 rounded-xl bg-card">
            <h3 className="text-xl font-bold mb-4">Send a Message</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border rounded-md p-2" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" className="w-full border rounded-md p-2" placeholder="+251..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea className="w-full border rounded-md p-2" rows="4" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
