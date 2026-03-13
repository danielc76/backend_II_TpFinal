import mongoose from "mongoose";

/*
Responsabilidad del modelo Ticket:
- Representar una compra realizada por un usuario.
- Guardar la información principal de la transacción.
- Cada ticket tiene un código único, fecha de compra,
  monto total y el email del comprador.
*/

const ticketSchema = new mongoose.Schema({

    // Código único del ticket
    code: {
        type: String,
        required: true,
        unique: true
    },

    // Fecha de compra
    purchase_datetime: {
        type: Date,
        default: Date.now
    },

    // Total pagado
    amount: {
        type: Number,
        required: true
    },

    // Email del usuario comprador
    purchaser: {
        type: String,
        required: true
    }

});

export const TicketModel = mongoose.model("Ticket", ticketSchema);
