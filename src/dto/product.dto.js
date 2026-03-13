/*
===========================================================
DTO (Data Transfer Object)
-----------------------------------------------------------
Los DTO sirven para validar y transformar datos antes
de que entren al sistema.

La idea es no confiar directamente en req.body.

Entonces:

req.body
   ↓
DTO
   ↓
objeto validado
===========================================================
*/

/*
===========================================================
DTO (Data Transfer Object) para productos
-----------------------------------------------------------
Valida y transforma los datos antes de que entren al sistema.
===========================================================
*/

// DTO para crear producto
export function toCreateProductDTO(body) {
    const { title, description, price, stock, category, owner } = body ?? {};

    // validación básica
    if (!title || typeof price !== "number" || typeof stock !== "number") {
        throw new Error("Payload incorrecto al crear producto");
    }

    return {
        title: String(title).trim(),
        description: description ? String(description).trim() : "",
        price,
        stock,
        category: category ? String(category).trim() : "",
        owner: owner ? String(owner).trim() : "admin"
    };
}

// DTO para actualizar producto
export function toUpdateProductDTO(body) {
    const out = {};

    if (body?.title) out.title = String(body.title).trim();
    if (body?.description) out.description = String(body.description).trim();
    if (typeof body?.price === "number") out.price = body.price;
    if (typeof body?.stock === "number") out.stock = body.stock;
    if (body?.category) out.category = String(body.category).trim();
    if (body?.owner) out.owner = String(body.owner).trim();

    return out;
}