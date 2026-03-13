import { CartModel } from "../models/cart.model.js";

/*
DAO responsable de la interacción directa con la base de datos
para las operaciones relacionadas con los carritos.
*/

export class CartDAO {

    async getById(id) {
        return await CartModel.findById(id).populate("products.product");
    }

    async create() {
        return await CartModel.create({ products: [] });
    }

    async save(cart) {
        return await cart.save();
    }

}
