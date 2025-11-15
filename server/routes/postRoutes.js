import { protect } from "../middlewares/authMiddleware.js";
import { showAllPosts, createPost, updatePost, editPost, deletePost } from "../controllers/postController.js";
import express from "express";

const router = express.Router();
router.get("/all", protect, showAllPosts);
router.get("/:id", protect, editPost);
router.post("/create", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router
