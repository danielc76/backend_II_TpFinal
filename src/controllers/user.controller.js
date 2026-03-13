import mongoose from "mongoose";
import { UserService } from "../services/user.service.js";
import { toCreateUserDTO, toUpdateUserDTO } from "../dto/user.dto.js";

/*
===========================================================
Controller de Users
-----------------------------------------------------------
Acá manejamos HTTP: req, res, next
- Nada de lógica compleja
- Solo coordinación entre Service y Response
===========================================================
*/

const svc = new UserService();

export const userController = {

  list: async (_req, res, next) => {
    try {
      const users = await svc.list();
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID inválido" });

      const user = await svc.getById(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const dto = toCreateUserDTO(req.body);
      const created = await svc.create(dto);
      res.status(201).json({ message: "Usuario creado correctamente", user: created });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { uid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(uid)) return res.status(400).json({ error: "ID inválido" });

      const dto = toUpdateUserDTO(req.body);
      const updated = await svc.update(uid, dto);
      if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json({ message: "Usuario actualizado correctamente", user: updated });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const { uid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(uid)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await svc.delete(uid);
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });

      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  }

};