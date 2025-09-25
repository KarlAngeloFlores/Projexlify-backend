// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     }
// });

// const emailService = {
//     sendVerificationCode: async (email, code, subject = 'Email Verification') => {
//         try {
//             await transporter.sendMail({
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject,
//                 html: `
//                     <div style="font-family:sans-serif;text-align:center;padding:20px;">
//                         <h2>${subject}</h2>
//                         <p>Your verification code is:</p>
//                         <p style="font-size:24px;font-weight:bold;">${code}</p>
//                         <p>© ${new Date().getFullYear()} Projexlify</p>
//                     </div>
//                 `
//             });
//         } catch (error) {
//             throw error;
//         }
//     },

//     sendNotification: async (email, subject, message) => {
//         try {
//             await transporter.sendMail({
//                 from: process.env.EMAIL,
//                 to: email,
//                 subject,
//                 html: `
//                     <div style="font-family:sans-serif;text-align:center;padding:20px;">
//                         <h2>${subject}</h2>
//                         <p>${message}</p>
//                         <p>© ${new Date().getFullYear()} Projexlify</p>
//                     </div>
//                 `
//             });
//         } catch (error) {
//             throw error;
//         }
//     }
// };

// module.exports = emailService;


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const emailService = {
    sendVerificationCode: async (email, code, subject = 'Email Verification') => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject,
                text: `Your verification code is: ${code}\n\n© ${new Date().getFullYear()} Projexlify`
            });
        } catch (error) {
            throw error;
        }
    },

    sendNotification: async (email, subject, message) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject,
                text: `${message}\n\n© ${new Date().getFullYear()} Projexlify`
            });
        } catch (error) {
            throw error;
        }
    }
};

module.exports = emailService;