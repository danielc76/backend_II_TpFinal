import { TicketModel } from "../models/ticket.model.js";

/*
Responsabilidad del DAO (Data Access Object):
- Encapsular el acceso directo a la base de datos.
- Realizar operaciones CRUD sobre los tickets.
- Evitar que el resto de la aplicación interactúe
  directamente con mongoose.
*/

export class TicketDAO {

    // Crear un ticket en la base de datos
    async create(ticket) {
        return await TicketModel.create(ticket);
    }

    // Obtener ticket por id
    async getById(id) {
        return await TicketModel.findById(id);
    }

}
