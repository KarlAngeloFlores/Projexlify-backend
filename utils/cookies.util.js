/**
 * Cookie configuration for Access Token
 * Short-lived (1 hour)
 */
const accessTokenCookieProd = () => ({
  httpOnly: true,
  secure: true,                      
  sameSite: 'None',                  
  maxAge: 60 * 60 * 1000,            // 1 hour
  path: '/',
  
});

const accessTokenCookieDev = () => ({
  httpOnly: true,
  secure: false,                     
  sameSite: 'Lax',                   
  maxAge: 60 * 60 * 1000,            // 1 hour
  path: '/'
});

// const accessTokenCookie = () => {
//   const isProd = process.env.NODE_ENV === 'Production';
//   return isProd ? accessTokenCookieProd() : accessTokenCookieDev();
// };

const accessTokenCookie = () => {
  return accessTokenCookieDev();
};

module.exports = {
  accessTokenCookie,
  accessTokenCookieProd,
  accessTokenCookieDev,
};
