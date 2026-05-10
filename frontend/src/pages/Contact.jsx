import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Contact Us
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Have questions or want to book an appointment? Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-primary text-2xl mb-4">📍</div>
                  <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">Addis Ababa, Ethiopia</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-primary text-2xl mb-4">📞</div>
                  <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+251 976 601 074</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-primary text-2xl mb-4">💬</div>
                  <h3 className="font-bold text-gray-900 mb-2">Telegram</h3>
                  <a href="https://t.me/GemachisTesfaye" target="_blank" rel="noreferrer" className="text-primary hover:underline">@GemachisTesfaye</a>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-primary text-2xl mb-4">🕒</div>
                  <h3 className="font-bold text-gray-900 mb-2">Working Hours</h3>
                  <p className="text-gray-600 text-sm">Mon-Sat: 8am - 8pm</p>
                  <p className="text-gray-600 text-sm">Sun: 9am - 5pm</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="+251 ..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                  <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all" rows="4" placeholder="How can we help?"></textarea>
                </div>
                <button type="button" className="btn-primary w-full py-4 text-lg">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
