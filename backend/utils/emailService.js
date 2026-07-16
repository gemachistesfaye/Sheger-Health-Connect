const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Gmail with strict timeouts
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000 // 15 seconds
  });

  // Define the email options
  const mailOptions = {
    from: `ShegerHealth <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
