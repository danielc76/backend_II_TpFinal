import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requiereJWT, requireManyRoles } from "../middleware/auth.middleware.js";
import { polices } from "../middleware/polices.middleware.js";

/*
===========================================================
Router de Users
-----------------------------------------------------------
Endpoints de la API de usuarios.
Solo usamos JWT para autenticación y autorización.
===========================================================
*/

const router = Router();

// Listar todos los usuarios (solo admin)
router.get(
    "/",
    requiereJWT,              // Valida JWT del header
    requireManyRoles("admin"),// Verifica rol admin
    userController.list
);

// Obtener un usuario por ID (solo admin)
router.get(
    "/:uid",
    requiereJWT,
    requireManyRoles("admin"),
    userController.get
);

// Registrar usuario nuevo (cualquiera puede registrarse)
router.post(
    "/register",
    userController.create
);

// Actualizar usuario por ID (solo admin)
router.put(
    "/:uid",
    requiereJWT,
    requireManyRoles("admin"),
    userController.update
);

// Eliminar usuario por ID (solo admin)
router.delete(
    "/:uid",
    requiereJWT,
    requireManyRoles("admin"),
    userController.remove
);

export default router;