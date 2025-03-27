import express, { json } from 'express';
import document from './controllers/document.js';
import health from './controllers/health.js';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(json());

app.use(express.static('public'));

// Basic route
app.use('/cvs', document)
app.use('/health', health)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});