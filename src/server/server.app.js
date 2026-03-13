// Dependencias que instalé:
// npm install express mongoose passport passport-local passport-jwt bcrypt dotenv cookie-parser express-session connect-mongo jsonwebtoken nodemailer

/*
============================================================================
ARQUITECTURA GENERAL DEL PROYECTO
============================================================================

La aplicación está organizada en capas. La idea es separar responsabilidades
para que cada parte del sistema tenga un único trabajo.

Flujo general de una request:

Cliente (Postman / Frontend)
        ↓
Router (define endpoints)
        ↓
Controller (maneja HTTP: req / res)
        ↓
Service (lógica de negocio)
        ↓
Repository (intermediario)
        ↓
DAO (acceso a datos)
        ↓
Model (Mongoose schema)
        ↓
MongoDB


Además existen capas transversales:

Middlewares → interceptan requests (auth, logger, roles, etc.)
Config → configuración global del sistema
Models → definición de estructuras de datos (MongoDB)
DTO → validación / transformación de datos
Factory → selección de DAO
============================================================================
*/


/*
============================================================================
ESTRUCTURA DE CARPETAS
============================================================================

TpFinal/
│
├── config/
│   ├── auth/
│   │   └── passport.config.js
│   │       # Configuración de Passport (estrategias de autenticación)
│   #
│   │       Estrategias implementadas:
│   │       - local ("login") → login tradicional email + password
│   │       - jwt ("current") → autenticación mediante token JWT
│   #
│   │       Passport se encarga de:
│   │       - validar credenciales
│   │       - generar sesiones o tokens
│   │       - adjuntar el usuario autenticado a req.user
│   │
│   ├── db/
│   │   └── connect.config.js
│   │       # Maneja la conexión a MongoDB
│   #
│   │       Permite conectar automáticamente:
│   │       - Mongo local
│   │       - Mongo Atlas
│   │
│   ├── env.config.js
│   │       # Carga variables de entorno desde .env
│   #
│   │       Ejemplos:
│   │       PORT
│   │       SECRET_SESSION
│   │       JWT_SECRET
│   │       MONGO_URI
│   │
│   │       También valida que existan antes de iniciar el server.
│   │
│   └── models/
│       ├── product.model.js
│       │       # Modelo de Mongoose para productos
│       #
│       │       Define la estructura del documento en Mongo:
│       │       - name
│       │       - email
│       │       - age
│       #
│       │       Este modelo es utilizado por:
│       │       - DAO
│       │       - Service
│       │
│       └── user.model.js
│               # Modelo de Mongoose para usuarios
│
│               Campos principales:
│               - first_name
│               - last_name
│               - email
│               - password
│               - age
│               - role
│
│               Este modelo se usa en:
│               - autenticación
│               - control de roles
│
│
├── middleware/
│   ├── auth.middleware.js
│   │       # Middlewares de autenticación
│   #
│   │       requireLogin:
│   │       - permite acceder solo a usuarios logueados
│   #
│   │       alreadyLogin:
│   │       - evita que un usuario logueado vuelva a login/register
│   #
│   │       requireJWT:
│   │       - protege rutas que requieren token JWT
│   #
│
│   ├── logger.middleware.js
│   │       # Middleware de logging
│   #
│   │       Intercepta cada request y muestra:
│   │       - método HTTP
│   │       - endpoint
│   │       - tiempo de respuesta
│   #
│
│   └── polices.middleware.js
│           # Middleware de autorización por roles
│
│           Ejemplo:
│           - admin
│           - user
│
│           Se usa para restringir acceso a ciertos endpoints.
│
│
├── routes/
│   ├── auth.router.js
│   │       # Rutas de autenticación
│   #
│   │       POST /register
│   │       → registra un usuario nuevo
│   #
│   │       POST /login
│   │       → login usando Passport local strategy
│   #
│   │       POST /logout
│   │       → destruye la sesión del usuario
│   #
│   │       GET /current
│   │       → devuelve el usuario logueado en sesión
│   #
│   │       OAuth GitHub:
│   │       /github
│   │       /github/callback
│   │       /github/fail
│   #
│   │       JWT:
│   │       /jwt/login
│   │       /jwt/current
│   #
│
│   ├── home.router.js
│   │       # Router simple de prueba
│   #
│   │       GET /
│   │       → devuelve mensaje de bienvenida
│   #
│
│   ├── jwt.router.js
│   │       # Router específico para endpoints JWT
│   #
│   │       GET /current
│   │       → devuelve usuario autenticado por token
│   #
│
│   ├── router.js
│   │       # Router principal de la aplicación
│   #
│   │       Este archivo centraliza todos los routers
│   │       y los monta en Express.
│   #
│   │       Ejemplo:
│   │       app.use("/api/auth", authRouter)
│   │       app.use("/api/products", productRouter)
│   │       app.use("/", homeRouter)
│   #
│
│   ├── product.router.js
│   │       # CRUD de productos
│   #
│   │       GET /products
│   │       → listar productos
│   #
│   │       POST /products
│   │       → crear producto
│   #
│   │       GET /products/:id
│   │       → obtener producto por ID
│   #
│   │       PUT /products/:id
│   │       → actualizar producto
│   #
│   │       DELETE /products/:id
│   │       → eliminar producto
│   #
│
│   └── user.router.js
│           # CRUD de usuarios
│
│           GET /users
│           → listar usuarios (requiere permisos)
│
│           POST /users/register
│           → registrar usuario
│
│           PUT /users/:uid
│           → actualizar usuario (admin)
│
│           DELETE /users/:uid
│           → eliminar usuario (admin)
│
│
├── server/
│   └── server.app.js
│           # Archivo principal que inicia la aplicación
│
│           Responsabilidades:
│           - configurar middlewares globales
│           - conectar a la base de datos
│           - configurar sesiones
│           - inicializar Passport
│           - montar routers
│           - iniciar el servidor HTTP
│
│
└── .env
        # Variables de entorno
        # Nunca se suben al repositorio
============================================================================
*/


import express from 'express';
import passport from 'passport';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

import environment, { validateEnv } from '../config/env.config.js';
import { initRouters } from '../routes/router.js';
import logger from './../middleware/logger.middleware.js';
import { connectAuto } from './../config/db/connect.config.js';
import { initPassport } from './../config/auth/passport.config.js';

import errorHandler from "../middleware/error.middleware.js";

import nodemailer from 'nodemailer';


const app = express();
const PORT = environment.PORT || 8000;
const SECRET_SESSION = environment.SECRET_SESSION || 'clave_secreta';


/* =========================================================================
   MIDDLEWARES GLOBALES
   =========================================================================

Los middlewares son funciones que interceptan las requests antes de que
lleguen a los routers.

Sirven para tareas comunes como:

- parsear JSON
- loguear requests
- manejar cookies
- autenticación
- validaciones

Se ejecutan en el orden en que se agregan con app.use()
========================================================================= */


// Permite que Express entienda JSON en req.body
app.use(express.json());


// Logger personalizado
// Muestra en consola cada request entrante
// Ejemplo:
// GET /api/products - 12ms
app.use(logger);


// Cookie parser
// Permite leer cookies desde req.cookies
// También permite firmarlas con un secret
app.use(cookieParser(SECRET_SESSION));



export const startServer = async () => {

    try {

        // Verifica que todas las variables necesarias del .env existan
        validateEnv();


        /*
        ============================================================
        CONEXIÓN A BASE DE DATOS
        ============================================================

        Esta función conecta automáticamente a MongoDB usando
        los datos de configuración.

        Si falla la conexión, la app no arranca.
        */

        await connectAuto();



        /*
        ============================================================
        SESSION STORE
        ============================================================

        Express-session permite mantener sesiones de usuarios.

        En vez de guardarlas en memoria (lo cual sería mala práctica),
        se guardan en MongoDB usando connect-mongo.

        Esto permite:
        - persistencia
        - escalabilidad
        */

        const store = MongoStore.create({

            client: ((await import("mongoose")).default.connection.getClient()),

            // duración de la sesión en base de datos
            ttl: 60 * 60

        });


        app.use(
            session({

                secret: SECRET_SESSION,

                resave: false,

                saveUninitialized: false,

                store,

                cookie: {

                    // duración de la cookie en el navegador
                    maxAge: 1 * 60 * 60 * 1000,

                    httpOnly: true,

                    signed: true

                }

            })
        );


        /*
        ============================================================
        PASSPORT
        ============================================================

        Passport es un middleware de autenticación.

        Se usa para implementar estrategias como:

        - login local
        - OAuth (GitHub, Google, etc)
        - JWT

        initPassport() registra todas las estrategias.
        */

        initPassport();

        app.use(passport.initialize());

        // habilita manejo de sesiones con Passport
        app.use(passport.session());


        /*
        ============================================================
        SERIALIZACIÓN DE USUARIO
        ============================================================

        Passport guarda solo el ID del usuario en la sesión.

        serializeUser:
        guarda el id en la sesión

        deserializeUser:
        recupera el usuario completo desde la DB
        */

        passport.serializeUser((user, done) => done(null, user._id));

        passport.deserializeUser(async (id, done) => {

            try {

                const UserModel = (await import('../models/user.model.js')).UserModel;

                const user = await UserModel.findById(id).lean();

                done(null, user || false);

            } catch (err) {

                done(err);

            }

        });



        /*
        ============================================================
        ROUTERS
        ============================================================

        Aquí se montan todos los endpoints de la aplicación.

        Cada router maneja un conjunto de rutas relacionadas.
        */

        initRouters(app);

        /* =========================
           Middleware de errores
           ========================= */

        // Este middleware captura cualquier error que haya pasado
        // por next(error) en controllers, services, etc.
        app.use(errorHandler);

        /*
        ============================================================
        INICIO DEL SERVIDOR
        ============================================================

        Finalmente se levanta el servidor HTTP.
        */

        app.listen(PORT, () => {

            console.log(`Servidor escuchando en http://localhost:${PORT}`);

        });


    } catch (error) {

        console.error("Error al iniciar el servidor:", error);

        process.exit(1);

    }

};


// Punto de entrada de la aplicación
startServer();