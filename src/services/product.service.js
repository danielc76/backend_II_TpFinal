import { productRepository } from "../repositories/product.repository.js";

/*
===========================================================
Service Layer
-----------------------------------------------------------
Acá vive la lógica de negocio.

El service decide qué hacer con los datos
antes de enviarlos al repository.
===========================================================
*/

class ProductService {

    async list() {
        return productRepository.getAll();
    }

    async getById(id) {
        return productRepository.getById(id);
    }

    async create(dto) {

        if (dto.price < 0) {
            throw new Error("El precio no puede ser negativo");
        }

        if (dto.stock < 0) {
            throw new Error("El stock no puede ser negativo");
        }

        return productRepository.create(dto);
    }

    async update(id, dto) {
        return productRepository.update(id, dto);
    }

    async delete(id) {
        const deleted = await productRepository.delete(id);
        return !!deleted;
    }

}

export const productService = new ProductService();
