import { TicketRepository } from "../repositories/ticket.repository.js";

const ticketRepository = new TicketRepository();

/*
Responsabilidad del Service:
- Contener la lógica de negocio del sistema.
- Generar el código único del ticket.
- Preparar los datos antes de enviarlos al repository.
*/

export class TicketService {

    async createTicket(amount, purchaser) {

        // Generación simple de código único
        const code = "TICKET-" + Date.now();

        const ticket = {
            code,
            amount,
            purchaser
        };

        return await ticketRepository.createTicket(ticket);
    }

}

export const ticketService = new TicketService();
