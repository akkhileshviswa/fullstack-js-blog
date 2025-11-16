import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for a user ID.
 * Creates a signed token with the user ID as payload.
 * 
 * @param {string|number} userId - The user ID to encode in the token
 * @returns {string} A signed JWT token string
 * 
 * @throws {Error} If JWT_SECRET_KEY environment variable is not set
 * @throws {Error} If token generation fails
 */
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
};

/**
 * Verifies and decodes a JWT token.
 * Validates the token signature and expiration.
 * 
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} The decoded token payload if valid, null if invalid or expired
 * 
 * @throws {Error} If token is malformed - caught and returns null
 * @throws {Error} If token is expired - caught and returns null
 * @throws {Error} If token signature is invalid - caught and returns null
 */
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded; 
    } catch(e) {
        console.error(e);
        return null;
    }
};
