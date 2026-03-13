/*
===========================================================
DTO de Users
-----------------------------------------------------------
Transformo el body de la request en un formato seguro.

- toCreateUserDTO: para registro
- toUpdateUserDTO: para actualizar datos
===========================================================
*/

export function toCreateUserDTO(body) {
  const { first_name, last_name, email, password, age, role } = body ?? {};
  if (!first_name || !last_name || !email || !password || !age) {
    throw new Error("Payload incorrecto para crear usuario!!");
  }
  return { first_name, last_name, email, password, age, role: role || "user" };
}

export function toUpdateUserDTO(body) {
  const out = {};
  if (body?.first_name) out.first_name = body.first_name;
  if (body?.last_name) out.last_name = body.last_name;
  if (body?.age) out.age = body.age;
  if (body?.role) out.role = body.role;
  return out;
}