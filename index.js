require("dotenv").config();
const express = require("express");

const servidor = express();

servidor.listen(process.env.PORT);
//las variables de entorno sivern para guardar datos sensibles como la BBDD contraseñas etc