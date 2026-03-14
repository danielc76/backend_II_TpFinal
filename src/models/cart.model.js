import mongoose from "mongoose";

/*
Modelo de carrito de compras.
Cada carrito contiene una lista de productos y la cantidad
de cada uno que el usuario desea comprar.
*/

const cartSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product", 
                required: true
            },

            quantity: {
                type: Number,
                default: 1
            }
        }
    ]

});

// Registramos el modelo como "Cart"
export const CartModel = mongoose.model("Cart", cartSchema);