import { postSchema } from "../utils/validationSchemas.js";
import { supabase } from "../config/supabaseClient.js";

export const showAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 4, search = "" } = req.query;
        const pageNum = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const from = (pageNum - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase.from("posts")
                        .select("*", { count: "exact" })
                        .eq("user_id", req.user.id)
                        .order("created_at", { ascending: false });

        if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

        const { data, error, count } = await query.range(from, to);

        if (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ message: "Failed to fetch posts" });
        }

        const totalPages = Math.ceil(count / pageSize);

        return res.status(200).json({
            posts: data,
            page: pageNum,
            totalPages,
            totalPosts: count,
        });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const validation_result = postSchema.safeParse(req.body);

        if (!validation_result.success) {
            return res.status(400).json({
                post: req.body,
                message: validation_result.error.issues[0].message
            });
        }

        const { title, content } = validation_result.data;

        const { data, error: postError } = await supabase
            .from("posts")
            .insert([{
                user_id: req.user.id,
                title,
                content
            }]);

        if (postError) {
            console.error("Error inserting posts: ", postError)
            return res.status(500).json({
                posts: [],
                message: "Error While Creating Posts. Contact Support!"
            });
        }

        res.status(201).json({ message: "Posts Created Succesfully!" });
    } catch (err) {
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const editPost = async (req, res) => {
    try {
        const { data, error: postError } = await supabase
            .from("posts")
            .select("*")
            .eq("id", req.params.id)
            .single();

        if (postError) {
            console.error("Error while retrieving post: ", postError)
            return res.status(500).json({
                posts: [],
                message: "Error While Retrieving Post. Contact Support!"
            });
        }

        res.status(201).json({ posts: data });
    } catch (err) {
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updatePost = async (req, res) => {
    try {
        const validation_result = postSchema.safeParse(req.body);
        if (!validation_result.success) {
            const errorMessage = validation_result.error.issues[0].message;

            return res.status(400).json({
                error: errorMessage,
                post: req.body,
            });
        }

        const { title, content } = req.body;

        const { data, error: postError } = await supabase
            .from("posts")
            .update({
                title,
                content
            })
            .eq("id", req.params.id);

        if (postError) {
            console.error("Error updating posts: ", postError)
            return res.status(500).json({ id, title, content, message: "Error While Updating Posts. Contact Support!" });
        }
        res.status(201).json({ message: "Post has been succesfully updated!" });
    } catch (err) {
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { data, error: postError } = await supabase
            .from("posts")
            .delete()
            .eq("id", req.params.id);

        if (postError) {
            console.error("Error deleting posts: ", postError)
            return res.status(500).json({ message: "Error While Deleting Posts. Contact Support!" });
        }

        res.status(201).json({ message: "Post has been succesfully deleted!" });
    } catch (err) {
        if (err.errors) return res.status(400).json({ errors: err.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};
