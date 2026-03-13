import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import passport from "passport"; // No usamos sesiones ni GitHub ahora

import { UserModel } from "../models/user.model.js";
// import { requireLogin, alreadyLogin, requiereJWT } from "../middleware/auth.middleware.js"; // requireLogin y alreadyLogin ya no se usan
import { requiereJWT } from "../middleware/auth.middleware.js";
import { toCurrentUserDTO } from "../dto/userCurrent.dto.js";

const router = Router();

/* =========================
   REGISTRO DE USUARIO LOCAL (JWT)
========================= */
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password, age } = req.body;

        if (!first_name || !last_name || !email || !password || !age) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            password: passwordHash,
            age
        });

        await newUser.save();

        res.status(201).json({
            message: "Usuario creado correctamente",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* =========================
   LOGIN CON JWT
========================= */
router.post("/jwt/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || !user.password) {
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
        message: "Login OK (JWT)",
        token
    });
});

/* =========================
   CURRENT (JWT)
========================= */
router.get("/jwt/current", requiereJWT, async (req, res) => {
    const user = await UserModel.findById(req.jwt.sub).lean();

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const dto = toCurrentUserDTO(user);
    res.json(dto);
});

/* =========================
   LOGIN CON SESSION (LOCAL) - COMENTADO
========================= */
/*
router.post("/login", alreadyLogin, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || "Credenciales inválidas" });

        req.logIn(user, { session: true }, (err2) => {
            if (err2) return next(err2);
            req.session.user = user;
            res.status(200).json({ message: "Login OK (session)", user });
        });
    })(req, res, next);
});
*/

/* =========================
   LOGOUT / CURRENT SESSION - COMENTADO
========================= */
/*
router.post("/logout", requireLogin, (req, res, next) => { ... });
router.get("/current", requireLogin, (req, res) => { ... });
*/

/* =========================
   LOGIN CON GITHUB - COMENTADO
========================= */
/*
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/api/auth/github/fail" }), ... );
router.get("/github/fail", (req, res) => { ... });
*/

export default router;