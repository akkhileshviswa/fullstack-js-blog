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

    if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
};
