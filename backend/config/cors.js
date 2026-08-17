// ei helper diye frontend URL sanitize kora hoy, pore request origin er sathe compare kora hoy.
// ei helper diye shudhu approved frontend domain guloi backend API access korte pare.
const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

// ei function e environment value theke configured frontend URLs read kora hoy, pore clean array e convert kora hoy.
// ei vabe API-te call korar jonno allowed domain list toiri kora hoy.
const configuredOrigins = (value) => String(value || 'http://localhost:5173,https://my-blood-connect.vercel.app')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

// Vercel preview deployment er jonno ei logic use kora hoy.
// tai deployment-generated preview URL guloi testing/review phase e backend e access nite pare.
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
