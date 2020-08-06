const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const dbPool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(req.body);
      const rows = await dbPool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user, req.flash("success", "Bienvenido " + user.email));
        } else {
          done(null, false, req.flash("message", "Contraseña Incorrecta"));
        }
      } else {
        return done(null, false, req.flash("message", "Usuario no registrado"));
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const {
        nombre,
        apellido,
        tipo_documento,
        documento,
        direccion,
        municipio,
        barrio,
      } = req.body;
      const newUser = {
        email,
        password,
        nombre,
        apellido,
        documento,
        tipo_documento,
        direccion,
        municipio,
        barrio,
      };
      newUser.password = await helpers.encryptPassword(password);

      const result = await dbPool.query("INSERT INTO users SET ?", [newUser]);
      newUser.id = result.insertId;

      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await dbPool.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
