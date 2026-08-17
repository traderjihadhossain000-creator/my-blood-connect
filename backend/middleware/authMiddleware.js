const jwt = require('jsonwebtoken');

// ei middleware diye request er Authorization header check kora hoy.
// JWT token thakle user ke authenticated hisabe accept kora hoy, na hole access stop kora hoy.
const protect = (req, res, next) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const token = header.slice(7).trim();
        if (!token) throw new Error('Missing token');
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload.id) throw new Error('Invalid payload');
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You do not have permission for this action' });
    }
    next();
};

module.exports = { protect, requireRole };
