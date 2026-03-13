import { UserModel } from "../models/user.model.js";

/*
===========================================================
DAO de Users
-----------------------------------------------------------
Acá interactuamos con la DB directo.
- Solo queries, nada de lógica de negocio.
===========================================================
*/

class UserDAO {

  async getAll() {
    return UserModel.find();
  }

  async getById(id) {
    return UserModel.findById(id);
  }

  async create(user) {
    return UserModel.create(user);
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }

  async existsByEmail(email) {
    return !!(await UserModel.exists({ email }));
  }
}

export default new UserDAO();