const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: `"EzyVoyage AI" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to EzyVoyage AI - Your Journey Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22d3ee; font-size: 2.5rem; margin-bottom: 10px;">EzyVoyage AI</h1>
            <p style="font-size: 1.2rem; margin: 0;">Your Next Adventure Starts Here</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #22d3ee; margin-top: 0;">Welcome, ${userName}! 🌟</h2>
            <p style="font-size: 1.1rem; line-height: 1.6;">
              Welcome to EzyVoyage AI! We're thrilled to have you join our community of adventurous travelers.
            </p>
            <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 0;">
              Your personalized travel planning experience is now ready. Let our AI-powered system craft the perfect journey tailored just for you, based on your preferences and travel style.
            </p>
          </div>
          
          <div style="background: rgba(34, 211, 238, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #22d3ee; margin-top: 0;">What's Next?</h3>
            <ul style="font-size: 1rem; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Explore AI-powered travel recommendations</li>
              <li>Discover hidden gems beyond the tourist trail</li>
              <li>Get perfectly timed itineraries for your adventures</li>
              <li>Experience personalized travel planning like never before</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 0.9rem; opacity: 0.8;">
              Happy travels,<br>
              The EzyVoyage AI Team
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const verifyEmailExists = async (email) => {
  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  sendWelcomeEmail,
  verifyEmailExists
};