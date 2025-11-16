import express from "express";
import { signup, signin, getProfile, logout } from "../controllers/authController.js";
import passport from "../middlewares/passport.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", protect, getProfile);
router.post("/logout", logout);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

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
