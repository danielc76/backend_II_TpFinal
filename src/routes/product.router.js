/*
===========================================================
Router de Products
-----------------------------------------------------------
Define las rutas de la API para productos.
Cada endpoint delega la lógica al controller correspondiente.
===========================================================
*/

import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { requiereJWT, requireManyRoles } from "../middleware/auth.middleware.js";

const router = Router();

/* =========================
   LISTADO DE PRODUCTOS
========================= */

// Obtener todos los productos
router.get("/", productController.list);

// Obtener un producto por ID
router.get("/:id", productController.get);

/* =========================
   OPERACIONES SOLO ADMIN
========================= */

// Crear un producto nuevo (solo admin)
router.post(
    "/",
    requiereJWT,                // Valida el JWT enviado en el header y asigna req.user
    requireManyRoles("admin"),  // Verifica que el usuario tenga rol admin
    productController.create
);

// Actualizar un producto existente por ID (solo admin)
router.put(
    "/:id",
    requiereJWT,
    requireManyRoles("admin"),
    productController.update
);

// Eliminar un producto por ID (solo admin)
router.delete(
    "/:id",
    requiereJWT,
    requireManyRoles("admin"),
    productController.remove
);

export default router;