const express = require('express');
const http = require('http'); 
const cors = require('cors');
require('dotenv').config();
const connectPostgresDB = require('./config/dbConfig');
const { sequelize } = require('./config/dbConfig');
const { initSocketServer } = require('./config/socketConfig'); // **NEW: Import initSocketServer**

// Connect to the database
connectPostgresDB();
sequelize.sync({ alter: true });

const app = express();

// Middleware (existing code)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// import Routes (existing code)
const patientRoutes = require('./routes/patientRoutes');

// Use Routes (existing code)
app.use('/api/patients', patientRoutes);

// Test route (existing code)
app.get("/", (req, res) => {
    res.send("API is live!");
});

// start the server
const PORT = process.env.PORT;

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize Socket.IO server
initSocketServer(server); 

// Listen on the created HTTP server
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

console.log("Hello World");