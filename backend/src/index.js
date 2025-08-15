require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const travelPlannerRoutes = require('./routes/travelplanner');
const travelAdvisoryRoutes = require('./routes/travelAdvisory');
const popularRoutes = require('./routes/popular');
const nicheRoutes = require('./routes/niche'); 
const fetchUserRoutes = require('./routes/fetchuser');
const dashboardRoutes = require('./routes/dashboard'); 
const recommendationsRoutes = require('./routes/recommendations');
const bookmarkedRoutes = require('./routes/bookmarked');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://ezyvoyage-ai.vercel.app',
  credentials: true
}));

app.use(cookieParser()); // Add cookie parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for passport
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 24 hours in seconds
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in ms
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/travel', travelPlannerRoutes);
app.use('/api/travel-advisory', travelAdvisoryRoutes);
app.use('/api/popular', popularRoutes);
app.use('/api/niche', nicheRoutes); 
app.use('/api/user', fetchUserRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/bookmarked', bookmarkedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;