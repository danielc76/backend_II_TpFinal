import bcrypt from "bcrypt";
import userDAO from "../dao/user.dao.js";

/*
===========================================================
Service de Users
-----------------------------------------------------------
Acá vive toda la lógica de negocio de Users:
- Validaciones
- Hash de password
- Decidir si se puede crear, actualizar o borrar
===========================================================
*/

export class UserService {

  async list() {
    return userDAO.getAll();
  }

  async getById(id) {
    return userDAO.getById(id);
  }

  async create(dto) {
    // ver si ya existe el email
    if (await userDAO.existsByEmail(dto.email)) {
      throw new Error(`El email ${dto.email} ya está en uso`);
    }

    // hash de password antes de guardar
    const hash = await bcrypt.hash(dto.password, 10);
    dto.password = hash;

    return userDAO.create(dto);
  }

  async update(id, dto) {
    return userDAO.update(id, dto);
  }

  async delete(id) {
    const deleted = await userDAO.delete(id);
    return !!deleted; // devuelve true/false si borró algo
  }
}