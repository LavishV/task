// Password validation: minimum 8 characters, at least one uppercase, one lowercase, one number, one special char
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// Username validation: 3-20 characters, alphanumeric and underscores only
export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

// Validate registration input
export const validateRegistration = (username, email, password) => {
    const errors = [];

    if (!username) {
        errors.push('Username is required');
    } else if (!validateUsername(username)) {
        errors.push('Username must be 3-20 characters (alphanumeric and underscores only)');
    }

    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (!validatePassword(password)) {
        errors.push(
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)'
        );
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Validate login input
export const validateLogin = (email, password) => {
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Sanitize input strings
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return input;
    }
    return input.trim().replace(/[<>]/g, '');
};
