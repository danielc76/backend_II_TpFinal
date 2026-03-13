import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { requireJwtCookie, requireManyRoles } from "../middleware/auth.middleware.js";

const router = Router();

/* =========================
   Listar todos los carritos (solo admin)
   - Solo los admins deberían listar todos los carritos
========================= */
router.get(
  "/",
  requireJwtCookie,
  requireManyRoles("admin"),
  cartController.list
);

/* =========================
   Ver un carrito por ID
   - Usuarios normales ven solo su carrito
   - Admins pueden ver cualquier carrito
========================= */
router.get(
  "/:cid",
  requireJwtCookie,
  requireManyRoles("user", "admin"),
  cartController.getById
);

/* =========================
   Vaciar carrito
   - Usuarios normales vacían su carrito
   - Admins pueden vaciar cualquier carrito
========================= */
router.delete(
  "/:cid",
  requireJwtCookie,
  requireManyRoles("user", "admin"),
  cartController.clear
);

/* =========================
   Crear carrito vacío
   - Se puede llamar desde user o admin
========================= */
router.post(
  "/",
  requireJwtCookie,
  requireManyRoles("user", "admin"),
  cartController.create // <-- ojo, hay que definir este método en cartController
);

/* =========================
   Agregar producto al carrito
   - Usuarios normales agregan a su carrito
   - Admins pueden agregar a cualquier carrito
========================= */
router.post(
  "/:cid/product/:pid",
  requireJwtCookie,
  requireManyRoles("user", "admin"),
  cartController.addProduct
);

/* =========================
   Realizar compra del carrito
   - Solo usuarios pueden comprar
   - Admin normalmente no realiza compra
========================= */
router.post(
  "/:cid/purchase",
  requireJwtCookie,
  requireManyRoles("user"),
  cartController.purchase
);

export default router;