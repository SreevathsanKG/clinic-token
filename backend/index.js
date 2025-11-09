const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectPostgresDB = require('./config/dbConfig');
const { sequelize } = require('./config/dbConfig');

// Connect to the database
connectPostgresDB();
sequelize.sync({ alter: true });

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// import Routes
const patientRoutes = require('./routes/patientRoutes');

// Use Routes
app.use('/api/patients', patientRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is live!");
});

// start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

console.log("Hello World");