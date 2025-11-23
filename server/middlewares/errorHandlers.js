/**
 * 404 error handler middleware.
 * Handles requests to routes that don't exist.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends 404 JSON response
 */
export function handle404(req, res, next) {
	res.status(404).json({ error: "Not found" });
}
