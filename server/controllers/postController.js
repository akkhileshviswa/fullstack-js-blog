import { postSchema } from "../utils/validationSchemas.js";
import { supabase } from "../config/supabaseClient.js";

/**
 * Retrieves all posts for the authenticated user with pagination and search.
 * 
 * @async
 * @function showAllPosts
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object from protect middleware
 * @param {string|number} req.user.id - User ID
 * @param {Object} req.query - Query parameters
 * @param {string|number} [req.query.page=1] - Page number for pagination
 * @param {string|number} [req.query.limit=4] - Number of posts per page
 * @param {string} [req.query.search=""] - Search query to filter posts by title
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with posts, pagination info, or error
 * 
 * @throws {Error} If database query fails - returns 500 with error message
 * @throws {Error} If server error occurs - returns 500 with error message
 */
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

/**
 * Creates a new blog post for the authenticated user.
 * 
 * @async
 * @function createPost
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object from protect middleware
 * @param {string|number} req.user.id - User ID
 * @param {Object} req.body - Request body containing post data
 * @param {string} req.body.title - Post title (min 5 characters)
 * @param {string} req.body.content - Post content (min 5 characters)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success message or error
 * 
 * @throws {Error} If validation fails - returns 400 with validation error message
 * @throws {Error} If database insert fails - returns 500 with error message
 * @throws {Error} If server error occurs - returns 500 with error message
 */
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

/**
 * Retrieves a single post by ID for editing.
 * 
 * @async
 * @function editPost
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Post ID to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with post data or error
 * 
 * @throws {Error} If database query fails - returns 500 with error message
 * @throws {Error} If post not found - returns 500 with error message
 * @throws {Error} If server error occurs - returns 500 with error message
 */
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

/**
 * Updates an existing blog post by ID.
 * 
 * @async
 * @function updatePost
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Post ID to update
 * @param {Object} req.body - Request body containing updated post data
 * @param {string} req.body.title - Updated post title (min 5 characters)
 * @param {string} req.body.content - Updated post content (min 5 characters)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success message or error
 * 
 * @throws {Error} If validation fails - returns 400 with validation error message
 * @throws {Error} If database update fails - returns 500 with error message
 * @throws {Error} If server error occurs - returns 500 with error message
 */
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

/**
 * Deletes a blog post by ID.
 * 
 * @async
 * @function deletePost
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Post ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success message or error
 * 
 * @throws {Error} If database delete fails - returns 500 with error message
 * @throws {Error} If server error occurs - returns 500 with error message
 */
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
