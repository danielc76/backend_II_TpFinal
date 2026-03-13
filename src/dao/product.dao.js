import { ProductModel } from "../models/product.model.js";

/*
===========================================================
DAO (Data Access Object)
-----------------------------------------------------------
El DAO es la capa que habla directamente con la base
de datos.

La idea es que el resto de la app NO conozca Mongoose.

Entonces:

Service
   ↓
DAO
   ↓
MongoDB
===========================================================
*/

class ProductDAO {

    async getAll() {
        return ProductModel.find();
    }

    async getById(id) {
        return ProductModel.findById(id);
    }

    async create(data) {
        return ProductModel.create(data);
    }

    async update(id, data) {
        return ProductModel.findByIdAndUpdate(id, data, {
            new: true
        });
    }

    async delete(id) {
        return ProductModel.findByIdAndDelete(id);
    }

}

export default new ProductDAO();

