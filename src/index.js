import express, { json } from 'express';
import document from './controllers/document.js';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(json());

// Basic route
app.use('/doc', document)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});