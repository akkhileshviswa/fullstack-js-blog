import express from "express";
import { signup, signin, getProfile, logout } from "../controllers/authController.js";
import passport from "../middlewares/passport.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", protect, getProfile);
router.post("/logout", logout);

/**
 * GET /auth/google - Initiates Google OAuth authentication flow.
 * Redirects user to Google's authentication page for OAuth consent.
 * 
 * @route GET /auth/google
 * @returns {void} Redirects to Google OAuth consent page
 * 
 * @throws {Error} If Google OAuth configuration is invalid
 * @throws {Error} If passport authentication fails
 */
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

/**
 * GET /auth/google/callback - Handles Google OAuth callback after user authentication.
 * Processes the OAuth response, sets authentication cookie, and redirects to frontend.
 * 
 * @route GET /auth/google/callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sets cookie and redirects to frontend callback page, or sends error response
 * 
 * @throws {Error} If Google OAuth authentication fails - returns 500 with "Internal server error"
 * @throws {Error} If user or token data is missing - returns 401 with "Google Sign In Failed" message
 * @throws {Error} If FRONTEND_URL environment variable is not set
 */
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, data) => {
        if (err) {
            console.error("Google Auth Error:", err);
            res.status(500).json({ message: "Internal server error" });
        }

        if (!data.user || !data.token) {
            return res.status(401).json({ message: "Google Sign In Failed. Contact Support!" });
        } 
        res.cookie("token",
            data.token,
            {
                httpOnly: true,
                secure: process.env.ENVIRONMENT === "prod",
                sameSite: "none",
                maxAge: 60 * 60 * 1000
            }
        );
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
    })(req, res, next);
});

export default router;
