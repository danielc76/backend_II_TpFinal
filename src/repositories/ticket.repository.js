import { TicketDAO } from "../dao/ticket.dao.js";

/*
Responsabilidad del Repository:
- Actuar como capa intermedia entre la lógica de negocio
  y el acceso a datos.
- Desacoplar los servicios de la implementación del DAO.
- Permitir cambiar la fuente de datos sin afectar
  la lógica de negocio.
*/

export class TicketRepository {

    constructor() {
        this.dao = new TicketDAO();
    }

    // Crear ticket usando el DAO
    async createTicket(data) {
        return await this.dao.create(data);
    }

}
