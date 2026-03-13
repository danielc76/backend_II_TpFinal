// passport.config.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { UserModel } from "../../models/user.model.js";

// Cargo variables de entorno
dotenv.config();

/*
===========================================================
Inicialización de Passport
-----------------------------------------------------------
Define estrategias de autenticación
===========================================================
*/
export const initPassport = () => {

  /*
    ===============================
    ESTRATEGIA LOCAL - LOGIN
    ===============================
    Permite autenticar con email y password.
    SOLO REFERENCIA: actualmente usamos JWT, NO se usa.
  */
  /*
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true // si quisieras sesiones con Passport
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });

          if (!user) return done(null, false, { message: "Usuario no encontrado" });

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

          return done(null, {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  */

  /*
    ===============================
    ESTRATEGIA JWT
    ===============================
    Esta es la que usamos.
    Valida token JWT, puede venir de:
      - Cookie "access_token"
      - Header Authorization: Bearer <token>
  */
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          req => req.cookies?.access_token,           // si viene en cookie
          ExtractJwt.fromAuthHeaderAsBearerToken()   // si viene en header Authorization
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          // Busco el usuario en DB usando _id del payload
          const user = await UserModel.findById(payload._id).lean();
          if (!user) return done(null, false);

          return done(null, {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};