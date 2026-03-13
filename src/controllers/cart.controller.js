import { cartService } from "../services/cart.service.js";
import { ticketService } from "../services/ticket.service.js";
import { CartModel } from "../models/cart.model.js";

/*
Controller encargado de manejar las solicitudes HTTP
relacionadas con los carritos de compra.
*/

export const cartController = {

    /* =========================
       Crear un carrito nuevo
    ========================= */
    async create(req, res) {
        try {
            const newCart = new CartModel({
                products: [] // carrito vacío al inicio
            });
            await newCart.save();
            res.status(201).json({
                message: "Carrito creado correctamente",
                cart: newCart
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /* =========================
       Agregar producto al carrito
    ========================= */
    async addProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await cartService.addProduct(cid, pid);
            res.json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    /* =========================
       Realizar compra del carrito
    ========================= */
    async purchase(req, res) {
        try {
            const cid = req.params.cid;
            const user = req.user;

            const cart = await CartModel.findById(cid).populate("products.product");

            if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

            let total = 0;
            const productsWithoutStock = [];

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

            if (total > 0) {
                const ticket = await ticketService.createTicket(total, user.email);

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
    },

    /* =========================
       Listar todos los carritos (admin)
    ========================= */
    async list(req, res) {
        try {
            const carts = await CartModel.find().populate("products.product").lean();
            res.json(carts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /* =========================
       Ver un carrito por ID
    ========================= */
    async getById(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid).populate("products.product").lean();
            if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    /* =========================
       Vaciar un carrito
    ========================= */
    async clear(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartModel.findById(cid);
            if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
            cart.products = [];
            await cart.save();
            res.json({ message: "Carrito vaciado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};