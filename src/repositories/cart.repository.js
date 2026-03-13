import { CartDAO } from "../dao/cart.dao.js";

/*
El repository desacopla la lógica de negocio del acceso
a datos permitiendo que los servicios utilicen una interfaz
más simple para trabajar con los carritos.
*/

export class CartRepository {

    constructor() {
        this.dao = new CartDAO();
    }

    async getCartById(id) {
        return await this.dao.getById(id);
    }

    async createCart() {
        return await this.dao.create();
    }

    async saveCart(cart) {
        return await this.dao.save(cart);
    }

}
