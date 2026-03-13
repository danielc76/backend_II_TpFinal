import mongoose from "mongoose";
import { productService } from "../services/product.service.js";
import { toCreateProductDTO, toUpdateProductDTO } from "../dto/product.dto.js";

/*
===========================================================
Controller de products
-----------------------------------------------------------
Esta capa maneja HTTP.

Recibe:
- req → datos de la request
- res → respuesta al cliente
- next → delega errores al middleware global
===========================================================
*/

export const productController = {

    // Listar todos los productos
    list: async (_req, res, next) => {
        try {
            const products = await productService.list();
            res.status(200).json({ products });

        } catch (error) {
            next(error);
        }
    },

    // Obtener un producto por ID
    get: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const product = await productService.getById(id);

            if (!product) {
                return res.status(404).json({ error: "El producto no existe" });
            }

            res.status(200).json(product);

        } catch (error) {
            next(error);
        }
    },

    // Crear un producto nuevo (solo admin)
    create: async (req, res, next) => {
        try {
            // Transformo y valido los datos con el DTO
            const dto = toCreateProductDTO(req.body);

            // Llamo al servicio para crear el producto
            const created = await productService.create(dto);

            res.status(201).json({
                message: "Producto creado correctamente",
                product: created
            });

        } catch (error) {
            next(error);
        }
    },

    // Actualizar un producto por ID (solo admin)
    update: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            // Transformo y valido los datos que vienen para actualización
            const dto = toUpdateProductDTO(req.body);

            const updated = await productService.update(id, dto);

            if (!updated) {
                return res.status(404).json({ error: "El producto no existe" });
            }

            res.status(200).json(updated);

        } catch (error) {
            next(error);
        }
    },

    // Eliminar un producto por ID (solo admin)
    remove: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const deleted = await productService.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: "El producto no existe" });
            }

            res.status(204).end();

        } catch (error) {
            next(error);
        }
    }

};