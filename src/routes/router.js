import homeRouter from "./home.router.js";
import productRouter from "./product.router.js";
import userRouter from "./user.router.js";
import authRouter from "./auth.router.js";
import jwtRouter from "./jwt.router.js";
import cartRouter from "./cart.router.js"; // <-- agregado

/*
  Router padre de la app.
  Acá se enganchan todos los routers para mantener el servidor ordenado.
*/
export function initRouters(app) {

    /* =========================
       HOME
    ========================= */
    app.use("/", homeRouter);

    /* =========================
       PRODUCTOS (CRUD)
    ========================= */
    app.use("/api/products", productRouter);

    /* =========================
       USUARIOS (CRUD)
    ========================= */
    app.use("/api/users", userRouter);

    /* =========================
       AUTENTICACIÓN (sesión / GitHub)
       login / register / current / logout
    ========================= */
    app.use("/api/auth", authRouter);

    /* =========================
       AUTENTICACIÓN CON JWT
       register / login / current / logout
    ========================= */
    app.use("/api/jwt", jwtRouter);

    /* =========================
       CARRITOS
    ========================= */
    app.use("/api/carts", cartRouter); // <-- agregado

    /* =========================
       404 - Ruta no encontrada
    ========================= */
    app.use((req, res) => {
        res.status(404).json({
            error: "Ruta no encontrada"
        });
    });
}