const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('MONGO_URI and JWT_SECRET must be configured in .env');
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const io = new Server(server, {
    cors: { origin: allowedOrigins, methods: ['GET', 'POST', 'PATCH', 'PUT'] }
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication required'));
        socket.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return next(new Error('Invalid or expired token'));
    }
});

io.on('connection', async (socket) => {
    socket.join(`user:${socket.user.id}`);
    try {
        const user = await User.findById(socket.user.id).select('city').lean();
        if (user?.city) socket.join(`city:${user.city}`);
    } catch {
        socket.disconnect(true);
    }
});
app.set('socketio', io);

app.get('/', (req, res) => res.json({ success: true, message: 'Blood Connect Phase 1 API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, service: 'blood-connect-api' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
    await connectDB();
    await User.migrateToUnifiedAccounts();
    server.listen(PORT, () => console.log(`Blood Connect API running on port ${PORT}`));
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    });
}

module.exports = { app, server, io, startServer };
