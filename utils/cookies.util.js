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

module.exports = {
    accessTokenCookie,
};
