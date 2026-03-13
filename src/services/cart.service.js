import { CartRepository } from "../repositories/cart.repository.js";
import { ProductModel } from "../models/product.model.js";

const cartRepository = new CartRepository();

/*
Service encargado de la lógica de negocio relacionada
con los carritos de compra.
*/

export class CartService {

    async addProduct(cartId, productId) {

        const cart = await cartRepository.getCartById(cartId);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const existingProduct = cart.products.find(
            p => p.product._id.toString() === productId
        );

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.products.push({
                product: productId,
                quantity: 1
            });

        }

        await cartRepository.saveCart(cart);

        return cart;

    }

}

export const cartService = new CartService();
