// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     }
// })

// const emailService = {
// sendVerificationCode: async (email, verificationCode, subject) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL,
//             to: email,
//             subject: subject,
//             html: `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #f4f6f8; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  
//   <!-- Header -->
//   <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
//     🔐 Email Verification
//   </h2>
  
//   <!-- Body -->
//   <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
//     Here is your verification code. Use this to complete your process.
//   </p>
  
//   <!-- Verification Code Box -->
//   <div style="text-align: center; margin: 24px 0;">
//     <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #007BFF; padding: 16px 28px; background: #ffffff; border: 2px dashed #007BFF; border-radius: 10px;">
//       ${verificationCode}
//     </span>
//   </div>
  
//   <!-- Divider -->
//   <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
//   <!-- Footer -->
//   <p style="font-size: 14px; color: #888; text-align: center; margin: 0 0 6px 0;">
//     This is an automated email. Please do not reply.
//   </p>
  
//   <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
//     © ${new Date().getFullYear()} Projexlify. All rights reserved.
//   </p>
// </div>
//             `
//         });
//     } catch (error) {
//         throw error;
//     }
// },

//     sendNotification: async (email, subject, message) => {
//         try {

//         await transporter.sendMail({
//         from: process.env.EMAIL,
//         to: email,
//         subject: subject,
//         html: `
// <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 12px; background: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
  
//   <!-- Header -->
//   <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">
//     ${subject}
//   </h2>
  
//   <!-- Body -->
//   <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 20px 0;">
//     ${message}
//   </p>
  
//   <!-- Divider -->
//   <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
  
//   <!-- Footer -->
//   <p style="font-size: 14px; color: #888; text-align: center; margin: 0 0 6px 0;">
//     This is an automated email. Please do not reply.
//   </p>
  
//   <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
//     © ${new Date().getFullYear()} Projexlify. All rights reserved.
//   </p>
// </div>
//         `
//         });


//         } catch (error) {
//             throw error;
//         }
//     }
// }

// module.exports = emailService;



const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL, to, subject, html });
    } catch (err) {
        console.error('Email send error:', err);
    }
};

const emailService = {
    sendVerificationCode: (email, code, subject = 'Email Verification') => {
        const html = `
            <div style="font-family:sans-serif;text-align:center;padding:20px;">
                <h2>${subject}</h2>
                <p>Your verification code is:</p>
                <p style="font-size:24px;font-weight:bold;">${code}</p>
                <p>© ${new Date().getFullYear()} Projexlify</p>
            </div>
        `;
        sendMail(email, subject, html);
    },

    sendNotification: (email, subject, message) => {
        const html = `
            <div style="font-family:sans-serif;text-align:center;padding:20px;">
                <h2>${subject}</h2>
                <p>${message}</p>
                <p>© ${new Date().getFullYear()} Projexlify</p>
            </div>
        `;
        sendMail(email, subject, html);
    }
};

module.exports = emailService;
