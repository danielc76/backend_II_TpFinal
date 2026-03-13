/*
===========================================================
Modelo de User
-----------------------------------------------------------
Acá definimos la estructura de un usuario en MongoDB.

Campos:
- first_name, last_name, email, password, age
- role: user/admin
- cart: referencia a carrito (si lo tiene)

RD: Este archivo solo define esquema y modelo. Nada de lógica de negocio.
===========================================================
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "user" }
}, { timestamps: true });

export const UserModel = mongoose.model("Users", userSchema);
