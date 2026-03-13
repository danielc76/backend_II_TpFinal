/*
===========================================================
DTO (Data Transfer Object) de Usuario (Current)
-----------------------------------------------------------
Este DTO se utiliza para devolver la información del usuario
actual autenticado sin exponer datos sensibles.

De esta manera evitamos enviar campos como password u otros
datos internos de la base de datos.
===========================================================
*/

export function toCurrentUserDTO(user) {

    return {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    };

}