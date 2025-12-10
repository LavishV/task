import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        createdByIp: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        revokedByIp: {
            type: String,
            default: null,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
        replacedByToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for automatic deletion of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method: check if token is expired
refreshTokenSchema.methods.isExpired = function () {
    return new Date() >= this.expiresAt;
};

// Method: check if token is active (not revoked and not expired)
refreshTokenSchema.methods.isActive = function () {
    return !this.isRevoked && !this.isExpired();
};

// Static method: generate a new refresh token
refreshTokenSchema.statics.generateToken = function () {
    return crypto.randomBytes(32).toString('hex');
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
