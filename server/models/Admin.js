import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            default: 'admin',
            enum: ['admin', 'super-admin'],
        },
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook: hash password if modified
adminSchema.pre('save', async function (next) {
    // Only hash password if it has been modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'));
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method: compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

// Method: check if account is locked
adminSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > new Date();
};

// Method: increment failed login attempts
adminSchema.methods.incLoginAttempts = async function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < new Date()) {
        return this.updateOne({
            $set: { failedLoginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    const updates = { $inc: { failedLoginAttempts: 1 } };

    // Lock the account after max failed attempts
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
    const lockTimeMs = parseInt(process.env.LOCK_TIME_MS || '1800000'); // 30 min default

    if (this.failedLoginAttempts + 1 >= maxAttempts && !this.isLocked()) {
        updates.$set = { lockUntil: new Date(Date.now() + lockTimeMs) };
    }

    return this.updateOne(updates);
};

// Method: reset failed login attempts
adminSchema.methods.resetLoginAttempts = async function () {
    return this.updateOne({
        $set: { failedLoginAttempts: 0, lastLoginAt: new Date() },
        $unset: { lockUntil: 1 },
    });
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
