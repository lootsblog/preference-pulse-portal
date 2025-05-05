import express from 'express';
import cors from 'cors';
import * as fs from 'fs/promises';
import * as path from 'path';
import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import { SurveyResponse } from './types';

const app = express();
const PORT = 3002;

// Get local IP address for CORS
const getLocalIpAddress = (): string => {
  const nets = networkInterfaces();
  let localIp = 'localhost';
  
  for (const name of Object.keys(nets)) {
    const net = nets[name];
    if (net) {
      for (const iface of net) {
        // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    if (localIp !== 'localhost') break;
  }
  
  return localIp;
};

// Configure CORS to allow all origins in development
const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow all origins in development
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Get the local IP address
    const localIp = getLocalIpAddress();
    
    // Allow localhost and local network IPs
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      `http://${localIp}:3000`,
      `http://${localIp}:5173`,
      // Add any other domains you want to allow
    ];

    // For development, you can log the origin for debugging
    console.log('Request origin:', origin);
    
    if (allowedOrigins.includes(origin) || origin?.startsWith(`http://${localIp}`)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Path to store responses
const RESPONSES_FILE = path.join(__dirname, 'data', 'survey_responses.json');

// Ensure data directory exists
async function ensureDataDir() {
    const dir = path.dirname(RESPONSES_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

// Initialize responses file if it doesn't exist
async function initResponsesFile() {
    try {
        await fs.access(RESPONSES_FILE);
    } catch {
        await fs.writeFile(RESPONSES_FILE, '[]', 'utf-8');
    }
}

// Read responses
async function readResponses(): Promise<SurveyResponse[]> {
    try {
        const data = await fs.readFile(RESPONSES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save responses
async function saveResponses(responses: SurveyResponse[]) {
    await fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2), 'utf-8');
}

// Initialize
(async () => {
    await ensureDataDir();
    await initResponsesFile();
})();

// Routes
app.post('/api/responses', async (req, res) => {
    try {
        const newResponse: SurveyResponse = req.body;
        const responses = await readResponses();

        // Find if user already exists
        const userIndex = responses.findIndex(r => r.userId === newResponse.userId);

        if (userIndex !== -1) {
            // Update existing user's responses
            responses[userIndex].responses.push(...newResponse.responses);
        } else {
            // Add new user response
            responses.push(newResponse);
        }

        await saveResponses(responses);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ error: 'Failed to save response' });
    }
});

app.get('/api/responses', async (req, res) => {
    try {
        const responses = await readResponses();
        res.json(responses);
    } catch (error) {
        console.error('Error reading responses:', error);
        res.status(500).json({ error: 'Failed to read responses' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Accessible on your network at: http://${getLocalIpAddress()}:${PORT}`);
});
