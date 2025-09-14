const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken, generateVerificationCode, verifyToken, throwError } = require('../utils/util');
const emailService = require('./email.service');
const { logInfo } = require('../utils/logs.util');

const authService = {
    
    login: async (email, password) => {
        try {
            const user = await userModel.findUserByEmail(email); 
            
            if(!user) {
                throwError('User not found', 404, true);
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch) {
                throwError('Invalid credentials', 401, true);
            }

            logInfo(user.email);
            
            const accessToken = generateToken({id: user.id, email: user.email}, '1h' );

            return { accessToken };

        } catch (error) {
            throw error;
        }    
        },
        
        getUser: async (id) => {
            try {
                
                const user = await userModel.findUserById(id);
                
                if(!user) {
                    throwError('User not found', 404, true);
                };

                return {
                    message: 'User found',
                    data: user
                }

            } catch (error) {
                throw error;
            }
        },
    
        register: async (email, username) => {
            try {
                
                const existingUser = await userModel.findUserByEmail(email);
                const existingUsername = await userModel.findUsername(username);

                if(!email || !username) {
                    throwError('Missing credentials', 400, true);
                };

                if(existingUser) {
                    throwError('User already exists', 409, true);
                };

                if(existingUsername) {
                    throwError('Username is already used', 409, true);
                };

                const token = generateToken({email, username}, '15m');

                const verificationCode = generateVerificationCode();
                const hashedCode = await bcrypt.hash(verificationCode.toString(), 10);
                const expires_at = new Date(Date.now() + 15 * 60 * 1000);
                const purpose = 'account_verification';
                
                //delete old code -> insert new code -> send code email
                await userModel.deleteVerificationCodeByEmail(email, 'account_verification');
                await userModel.insertVerificationCodeByEmail(email, hashedCode, purpose, expires_at);
                
                const subject = 'Registration verification code - Project Management System';
                const resultEmail = await emailService.sendVerificationCode(email, verificationCode, subject);

                return {
                    message: "Sent email verification code",
                    token
                };

            } catch (error) {
                throw error;
            }
        },

        
        registerAndVerify: async (token, password, code) => {
        
            try {
                logInfo(code);
                if (!token || !password || !code) {
                    throwError('Missing credentials', 400, true);
                }

                
                let decoded;
                
                try {
                decoded = verifyToken(token); // if using jwt.verify, it will throw if expired
                } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    throwError('Verification token expired. Please register again.', 401, true);
                }
                throwError('Invalid verification token', 401, true);
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const { email, username } = decoded;

                const purpose = 'account_verification';
                const record = await userModel.findVerificationCodeByEmail(email, purpose);

                if (new Date(record.expires_at) < new Date()) {
                    throwError('Verification code expired', 400, true);
                }

                logInfo(record);
                const isMatchCode = await bcrypt.compare(code.toString(), record.code_hash);

                if(!isMatchCode) {
                    throwError('Invalid verification code', 400, true);
                };
                
                await userModel.deleteVerificationCodeByEmail(email, purpose);
                const data = await userModel.createUser(email, hashedPassword, username);

                return {
                    message: 'Successful registration.',
                    data
                }

            } catch (error) {
                throw error;
            }
        },

        forgotPassword: async (email) => {
            try {
                
                const existingUser = userModel.findUserByEmail(email);

                if(!existingUser) {
                    throwError('Email is not registered', 404, true);
                }

                const passVerificationCode = generateVerificationCode();
                const hashedCode = await bcrypt.hash(passVerificationCode.toString(), 10);

                const purpose = 'password_reset';
                const expires_at = new Date(Date.now() + 15 * 60 * 1000);

                //delete old code -> insert new code -> send code email
                await userModel.deleteVerificationCodeByEmail(email, purpose);
                await userModel.insertVerificationCodeByEmail(email, hashedCode, purpose, expires_at);

                const subject = 'Forgot password - Verfication code'
                await emailService.sendVerificationCode(email, passVerificationCode, subject);
                
                return {
                    message: 'Sent email verification code', 
                }

            } catch (error) {
                throw error;      
            }
        },

        verifyResetPassword: async (email, code) => {
            try {
                
            if(!email || !code) {
                throwError('Missing credentials', 400, true);
            };
            
            const purpose = 'password_reset';
            const record = await userModel.findVerificationCodeByEmail(email, purpose);
            
            if(!record) {
                throwError('No verification code found', 404, true);
            }
            
            if (new Date(record.expires_at) < new Date()) {
                    throwError('Verification code expired', 400, true);
            }

            const isMatchCode = await bcrypt.compare(code.toString(), record.code_hash);
            if(!isMatchCode) {
                throwError('Invalid verification code', 400, true);
            };

            await userModel.deleteVerificationCodeByEmail(email, purpose);

            return {
                message: 'Successful verification code',
                success: true
            }

            } catch (error) {
                throw error;
            } 
        },

        resendVerificationCode: async (email, purpose) => {
            
            try {
                
            const record = await userModel.findVerificationCodeByEmail(email, purpose);

             //generate new code to send
            await userModel.deleteVerificationCodeByEmail(email, purpose);
            const newCode = generateVerificationCode();
            const hashedCode = await bcrypt.hash(newCode.toString(), 10);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            await userModel.insertVerificationCodeByEmail(email, hashedCode, purpose, expiresAt);
            await emailService.sendVerificationCode(email, newCode, "Resent verification code");

            return {
                message: 'Verification code resent successfully'
            }
           
            } catch (error) {
                throw error;
            }
        },

        confirmNewPassword: async (email, newPassword, confirmPassword) => {
            try {
                
                const existingUser = await userModel.findUserByEmail(email);

                if(!existingUser) {
                    throwError('User not found', 404, true);
                };

                if(!newPassword || !confirmPassword) {
                    throwError('Missing credentials', 400, true);
                };

                if (newPassword !== confirmPassword) {
                    throwError('Passwords do not match.', 400, true);
                }

                const passwordIsMatch = await bcrypt.compare(newPassword, existingUser.password);
                if(passwordIsMatch) {
                    throwError('Password cannot be the same as your current password.', 400, true);
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const result = await userModel.createNewPassword(email, hashedPassword);

                const loginPageURL = `http://localhost:5173`;
                await emailService.sendNotification(email, 'Forgot password', `Your password has been changed successfully. Try logging it again ${loginPageURL}`);

                return {
                    message: 'Changed password successfully'
                };

            } catch (error) {
                throw error;
            }
        },

        changePassword: async (userId, oldPassword, newPassword) => {
            
            try {
            
                const user = await userModel.findPasswordById(userId);
                if(!user) {
                    throwError('User not found', 404, true);
                };

                const isMatchOldPassword = await bcrypt.compare(oldPassword, user.password);
                if(!isMatchOldPassword) {
                    throwError('Old password do not match');
                };

                if(oldPassword === newPassword) {
                    throwError('New password must be different from old password', 400, true);
                }

                const loginPageURL = `http://localhost:5173`;
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                await userModel.createNewPassword(user.email, hashedNewPassword);
                await emailService.sendNotification(user.email, 'Change password', `Your password has been changed successfully. Try logging it again ${loginPageURL}`);
                
                return {
                    message: "Password changed successfully"
                };

            } catch (error) {
                throw error;                
            }
        }

    }

module.exports = authService;