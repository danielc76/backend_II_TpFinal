// auth.middleware.js
import jwt from "jsonwebtoken";
import passport from "passport";

/*
===========================================================
Middlewares de autenticación y autorización
===========================================================
*/

// ===============================
// Opciones de sesión (NO USAMOS, solo referencia)
// ===============================

// Verifica que exista una sesión activa (solo si usaras sesiones clásicas)
/*
export function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "No autorizado" });
    }
    next();
}
*/

// Evita que un usuario logueado vuelva a loguearse (solo sesiones)
/*
export function alreadyLogin(req, res, next) {
    if (req.session && req.session.user) {
        return res.status(403).json({ error: "El usuario ya inició sesión" });
    }
    next();
}
*/

// ===============================
// Control de roles (puede usar sesión o JWT)
// ===============================

// Autorización por un rol específico
export function requireRole(role) {
    return (req, res, next) => {
        const user = req.session?.user || req.user; // si usaras sesión, req.session.user; sino req.user del JWT
        if (!user) {
            return res.status(401).json({ error: "No autorizado" });
        }
        if (user.role !== role) {
            return res.status(403).json({ error: "Acceso prohibido" });
        }
        next();
    };
}

// Autorización por múltiples roles
export function requireManyRoles(...roles) {
    return (req, res, next) => {
        const user = req.user || req.session?.user; // soporte sesión o JWT
        if (!user) {
            return res.status(401).json({ error: "No autorizado" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: "Acceso prohibido" });
        }
        next();
    };
};

// ===============================
// Validación JWT manual desde header
// ===============================
export function requiereJWT(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ error: "Token faltante" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos solo la info necesaria para control de roles
        req.user = {
            _id: decoded._id || decoded.sub,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

// ===============================
// Middleware de Passport para JWT desde cookie
// ===============================
// Este lo usamos si querés autenticar con passport-jwt
// y cookie "access_token" en vez de header Authorization
export const requireJwtCookie = passport.authenticate("jwt", { session: false });