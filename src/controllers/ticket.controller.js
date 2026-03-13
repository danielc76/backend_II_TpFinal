import { ticketService } from "../services/ticket.service.js";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

/*
Responsabilidad del Controller:
- Recibir las requests HTTP.
- Coordinar la lógica de compra.
- Verificar stock de productos.
- Generar tickets mediante el service.
- Devolver la respuesta al cliente.
*/

export const cartController = {

    async purchase(req, res) {

        try {

            const cid = req.params.cid;
            const user = req.user;

            // Buscar carrito y cargar productos
            const cart = await CartModel.findById(cid).populate("products.product");

            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let total = 0;
            const productsWithoutStock = [];

            // Verificación de stock
            for (const item of cart.products) {

                const product = item.product;
                const quantity = item.quantity;

                if (product.stock >= quantity) {

                    product.stock -= quantity;
                    await product.save();

                    total += product.price * quantity;

                } else {

                    productsWithoutStock.push(product._id);

                }
            }

            // Generar ticket si hay compra válida
            if (total > 0) {

                const ticket = await ticketService.createTicket(
                    total,
                    user.email
                );

                // eliminar del carrito los productos comprados
                cart.products = cart.products.filter(
                    p => !productsWithoutStock.includes(p.product._id)
                );

                await cart.save();

                return res.json({
                    status: "success",
                    ticket,
                    productsWithoutStock
                });

            }

            res.status(400).json({
                error: "No se pudo procesar la compra",
                productsWithoutStock
            });

        } catch (error) {

            res.status(500).json({ error: error.message });

        }

    }

};
