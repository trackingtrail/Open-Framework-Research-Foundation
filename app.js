require('dotenv').config();
const cookieParser = require("cookie-parser");

// Import necessary modules
const express = require('express');
const helmet = require('helmet');
const sequelize = require('./config/db');

// Initialize Express app
const app = express();

// Use middleware
app.use(cookieParser());
app.use(helmet());
app.use(express.json()); // Parse JSON bodies

// Use the routers with their respective base paths
app.use('/api/auth', loginRouter);
app.use('/api/register', registrationRouter);


// Test database connection and sync models
async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
        await sequelize.sync();
        console.log('Database synced!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Define a route for GET requests to the root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server after ensuring the database is connected and synced
assertDatabaseConnectionOk().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});