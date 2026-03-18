import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = (roles = []) => {
  // If roles is a string, convert it to an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // 1. Authenticate the token
    async (req, res, next) => {
      const token = req.header("x-auth-token");

      if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // This adds { id: '...', role: '...' } to the request
        next();
      } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
      }
    },
    // 2. Authorize based on roles (if any)
    (req, res, next) => {
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied. Not authorized." });
      }
      next();
    }
  ];
};

export default auth;