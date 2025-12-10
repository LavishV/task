import Admin from '../models/Admin.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import { validateRegistration, validateLogin, sanitizeInput } from '../utils/validation.js';

// Helper function to generate JWT access token
const generateAccessToken = (adminId, role) => {
    return jwt.sign(
        { adminId, role },
        process.env.JWT_ACCESS_SECRET || 'access-secret-key',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
        }
    );
};

// Helper function to generate and save refresh token
const generateRefreshToken = async (adminId, ip, userAgent) => {
    const token = RefreshToken.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days default

    const refreshTokenDoc = new RefreshToken({
        token,
        adminId,
        expiresAt,
        createdByIp: ip,
        userAgent: userAgent || null,
    });

    await refreshTokenDoc.save();
    return token;
};

export const registerAdmin = async (req, res) => {
    try {
        // Only allow registration if SEED_ADMIN is true (should be done once)
        if (process.env.ALLOW_REGISTRATION !== 'true') {
            return res.status(403).json({ error: 'Registration is disabled' });
        }

        const { username, email, password } = req.body;

        // Validate input
        const validation = validateRegistration(username, email, password);
        if (!validation.isValid) {
            return res.status(400).json({ errors: validation.errors });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ email: email.toLowerCase() }, { username: sanitizeInput(username) }],
        });

        if (existingAdmin) {
            return res.status(409).json({ error: 'Admin with this email or username already exists' });
        }

        // Create new admin
        const admin = new Admin({
            username: sanitizeInput(username),
            email: email.toLowerCase(),
            password,
            role: 'admin',
        });

        await admin.save();

        // Generate tokens
        const accessToken = generateAccessToken(admin._id, admin.role);
        const refreshToken = await generateRefreshToken(
            admin._id,
            req.ip,
            req.get('user-agent')
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            accessToken,
            refreshToken,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLogin(email, password);
        if (!validation.isValid) {
            return res.status(400).json({ errors: validation.errors });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if account is locked
        if (admin.isLocked()) {
            const lockTime = Math.ceil((admin.lockUntil - new Date()) / 1000 / 60); // minutes
            return res.status(423).json({
                error: `Account is locked. Try again in ${lockTime} minutes`,
            });
        }

        // Compare password
        const passwordMatch = await admin.comparePassword(password);

        if (!passwordMatch) {
            // Increment failed login attempts
            await admin.incLoginAttempts();

            if (admin.isLocked()) {
                const lockTime = Math.ceil((admin.lockUntil - new Date()) / 1000 / 60);
                return res.status(423).json({
                    error: `Too many failed attempts. Account locked for ${lockTime} minutes`,
                });
            }

            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Reset failed login attempts on successful login
        await admin.resetLoginAttempts();

        // Generate tokens
        const accessToken = generateAccessToken(admin._id, admin.role);
        const refreshToken = await generateRefreshToken(
            admin._id,
            req.ip,
            req.get('user-agent')
        );

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Find refresh token in database
        const tokenDoc = await RefreshToken.findOne({ token: refreshToken })
            .populate('adminId', 'role');

        if (!tokenDoc || !tokenDoc.isActive()) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        // Optional: Detect token reuse (advanced security)
        if (tokenDoc.replacedByToken) {
            // Token has been replaced, this could indicate token reuse attack
            await RefreshToken.updateMany(
                { adminId: tokenDoc.adminId },
                { isRevoked: true, revokedAt: new Date() }
            );
            return res.status(401).json({ error: 'Token reuse detected. All sessions revoked. Please login again.' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(tokenDoc.adminId._id, tokenDoc.adminId.role);

        // Rotate refresh token: revoke old, create new
        tokenDoc.isRevoked = true;
        tokenDoc.revokedAt = new Date();
        await tokenDoc.save();

        const newRefreshToken = await generateRefreshToken(
            tokenDoc.adminId._id,
            req.ip,
            req.get('user-agent')
        );

        // Mark old token as replaced
        tokenDoc.replacedByToken = newRefreshToken;
        await tokenDoc.save();

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // Revoke the refresh token
            await RefreshToken.updateOne(
                { token: refreshToken },
                {
                    isRevoked: true,
                    revokedAt: new Date(),
                    revokedByIp: req.ip,
                }
            );
        }

        res.status(204).send();
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const admin = await Admin.findById(req.user.adminId).select('-password');

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            lastLoginAt: admin.lastLoginAt,
            createdAt: admin.createdAt,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const revokeAllSessions = async (req, res) => {
    try {
        // Revoke all refresh tokens for the current user
        await RefreshToken.updateMany(
            { adminId: req.user.adminId },
            {
                isRevoked: true,
                revokedAt: new Date(),
                revokedByIp: req.ip,
            }
        );

        res.json({ message: 'All sessions revoked' });
    } catch (error) {
        console.error('Revoke all sessions error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const unlockAccount = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Only super-admin can unlock accounts
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({ error: 'Only super-admin can unlock accounts' });
        }

        const admin = await Admin.findByIdAndUpdate(
            adminId,
            {
                failedLoginAttempts: 0,
                $unset: { lockUntil: 1 },
            },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json({ message: 'Account unlocked', admin });
    } catch (error) {
        console.error('Unlock account error:', error);
        res.status(500).json({ error: error.message });
    }
};
