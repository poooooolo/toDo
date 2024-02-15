require("dotenv").config();
const express = require("express");

const servidor = express();

servidor.use(("/pruebas"),express.static("./pruebas-api"))

servidor.get("/api-to-do",(peticion,respuesta) => {

    respuesta.send("metodo GET")
   
});

servidor.post("/api-to-do",(peticion,respuesta) => {

    respuesta.send("metodo POST")
   
});

servidor.put("/api-to-do",(peticion,respuesta) => {

    respuesta.send("metodo PUT")
});

servidor.delete("/api-to-do",(peticion,respuesta) => {

    respuesta.send("metodo DELETE")

});

servidor.use((petición,respuesta) => {
    respuesta.json({error : "not found"})
})

servidor.listen(process.env.PORT);//las variables de entorno sivern para guardar datos sensibles como la BBDD contraseñas etc



//punto de entrada con GET /api-todo
//si nos hacen una petición POST a /api-todo/crear peticion : {tarea : "texto"} respuesta : {id}

//DELETE /api-todo/borrar/:id

//PUT a /api-todo/actualizar/:id/:operacion

//operacion 1 -> editar texto -> peticion { tarea : "texto nuevo"}
//operación 2 -> toggle estado

// respuesta: [{id,tarea,terminada}] o respuesta {"error en servidor"}500
// respuesta: {"error en la petición"}400
// respuesta: {"error not found"}404