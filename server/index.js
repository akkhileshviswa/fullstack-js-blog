import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handle404 } from "./middlewares/errorHandlers.js";
import passport from "./middlewares/passport.js";
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js'

const app = express();
const PORT = process.env.APP_PORT || 5000;
const __dirname = process.cwd();

app.use(helmet());

app.use(cors({
	origin: process.env.FRONTEND_URL,
	methods: ["GET", "POST" , "PUT", "DELETE"],
	credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
	
// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use(handle404);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
