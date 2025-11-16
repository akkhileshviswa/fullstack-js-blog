import { verifyToken } from "../utils/jwt.js";

/**
 * Authentication middleware to protect routes.
 * Verifies JWT token from Authorization header or cookies and attaches user to request.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.authorization] - Bearer token in Authorization header
 * @param {Object} req.cookies - Request cookies
 * @param {string} [req.cookies.token] - JWT token in cookie
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if authenticated, sends 401 response if not
 * 
 * @throws {Error} If no token is provided - returns 401 with "Not authenticated" message
 * @throws {Error} If token is invalid or expired - returns 401 with "Session expired" message
 */
export const protect = (req, res, next) => {
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = verifyToken(token);

    if (!decoded) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.ENVIRONMENT === "prod",
            sameSite: "none",
        });

        return res.status(401).json({ message: "Session expired. Login to Continue!" });
    }

    req.user = decoded;
    next();
};
