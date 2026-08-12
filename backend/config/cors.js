const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

const configuredOrigins = (value) => String(value || 'http://localhost:5173,https://my-blood-connect.vercel.app')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const isProjectVercelPreview = (origin) => {
    try {
        const url = new URL(origin);
        return url.protocol === 'https:' && /^my-blood-connect(?:-[a-z0-9-]+)?-jihadsproject\.vercel\.app$/i.test(url.hostname);
    } catch {
        return false;
    }
};

const createOriginValidator = (frontendUrl) => {
    const allowed = new Set(configuredOrigins(frontendUrl));
    return (origin, callback) => {
        if (!origin || allowed.has(normalizeOrigin(origin)) || isProjectVercelPreview(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by CORS'));
    };
};

module.exports = { configuredOrigins, isProjectVercelPreview, createOriginValidator };
