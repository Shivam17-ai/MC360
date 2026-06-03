exports.success = (res, data) => res.json({ success: true, data });
exports.error = (res, message, status = 500) => res.status(status).json({ success: false, message });
