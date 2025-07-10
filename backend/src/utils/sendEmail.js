const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'EzyVoyage AI <no-reply@ezyvoyage.ai>',
    to: email,
    subject: 'Welcome to EzyVoyage AI!',
    text: `Hello ${name},\n\nWelcome to EzyVoyage AI! Start planning your adventures today.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendWelcomeEmail;