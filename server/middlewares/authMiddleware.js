import { verifyToken } from "../utils/jwt.js";

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
