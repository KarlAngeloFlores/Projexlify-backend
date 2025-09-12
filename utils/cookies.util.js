/**
 * Cookie configuration for Access Token
 * Short-lived (1 hour)
 */
const accessTokenCookie = () => {
    const isProd = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: false,                // HTTPS only in production
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000,         // 1 hour
        path: '/'
    };
};

/**
 * Cookie configuration for Refresh Token
 * Long-lived (7 days)
 */
const refreshTokenCookie = () => {
    const isProd = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: false,                // HTTPS only in production
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
    };
};

module.exports = {
    accessTokenCookie,
    refreshTokenCookie
};
