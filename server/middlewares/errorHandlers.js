export function handle404(req, res, next) {
	res.status(404).json({ error: "Not found" });
}
