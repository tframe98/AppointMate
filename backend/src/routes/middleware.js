import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("Authorization header missing.");
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.error("Token missing from authorization header.");
    return res.status(403).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};