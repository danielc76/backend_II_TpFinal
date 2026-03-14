/*
===========================================================
Modelo de product
-----------------------------------------------------------
Acá definimos el esquema de Mongoose.

Esto básicamente representa cómo se va a guardar
un producto en MongoDB.

Cada campo tiene su tipo y algunas restricciones.
===========================================================
*/
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: String,

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    category: String,

    owner: {
        type: String,
        default: "admin"
    }

});

export const ProductModel = mongoose.model("product", productSchema);
