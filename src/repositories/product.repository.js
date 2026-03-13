import productDAO from "../dao/product.dao.js";

/*
===========================================================
Repository Pattern
-----------------------------------------------------------
El repository es una capa intermedia entre
la lógica de negocio (service) y el DAO.

Permite cambiar la persistencia sin afectar
la lógica del negocio.
===========================================================
*/

class ProductRepository {

    async getAll() {
        return productDAO.getAll();
    }

    async getById(id) {
        return productDAO.getById(id);
    }

    async create(data) {
        return productDAO.create(data);
    }

    async update(id, data) {
        return productDAO.update(id, data);
    }

    async delete(id) {
        return productDAO.delete(id);
    }

}

export const productRepository = new ProductRepository();
