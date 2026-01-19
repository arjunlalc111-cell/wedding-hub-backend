import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

// ------------ Auth Middlewares ------------

export function requireAuth(req, res, next) {
  try {
    const auth = (req.headers.authorization || "").trim();
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.vendorId = decoded.sub || decoded.vendorId || null;
    req.userId = decoded.userId || decoded.id || null;
    req.tokenPayload = decoded;
    req.isTokenAdmin = !!decoded.isAdmin || decoded.role === "admin";
    req.role = decoded.role || null;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function vendorAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token" });
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "vendor")
      return res.status(401).json({ message: "Not vendor token" });
    req.vendorId = decoded.sub || decoded.vendorId;
    req.tokenPayload = decoded;
    req.role = decoded.role || null;
    return next();
  } catch {
    return res.status(401).json({ message: "Expired or invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  try {
    if (req.isTokenAdmin) return next();

    const auth = (req.headers.authorization || "").trim();
    if (auth && auth.startsWith("Bearer ")) {
      try {
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && (decoded.isAdmin || decoded.role === "admin")) {
          req.tokenPayload = decoded;
          req.isTokenAdmin = true;
          req.role = decoded.role || null;
          return next();
        }
      } catch {
        // ignore and fallback to header
      }
    }
    const secretHeader = (req.headers["x-admin-secret"] || "").toString();
    if (
      ADMIN_SECRET &&
      secretHeader &&
      secretHeader === ADMIN_SECRET
    ) {
      return next();
    }

    return res.status(403).json({ message: "Admin privileges required" });
  } catch {
    return res.status(403).json({ message: "Admin privileges required" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.role || (req.tokenPayload?.role);
    if (!userRole || userRole !== role) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
}

// ------------ Export Default ------------

export default requireAuth;