require("dotenv").config();
const express = require("express");
const {json} = require("body-parser")
const {getTareas,crearTarea} = require("./db");

const servidor = express();

servidor.use(json());//cualquier cosa que venga con content-type json es procesado por body-parser

servidor.use(("/pruebas"),express.static("./pruebas-api"))

servidor.get("/api-to-do", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas();
        respuesta.json(tareas);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
   
});

servidor.post("/api-to-do/crear", async (peticion,respuesta, siguiente) => {

        let {tarea} = peticion.body; //saca la tarea del cuerpo de la peticion

        if(tarea && tarea.trim() != ""){
            return respuesta.send("metodo POST")
        }

        siguiente("no me enviaste tarea")
        // throw "no me has enviado una tarea"//si cae aqui lo lanza al último middleware use

    // console.log(peticion.body) el body del fetch

   
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


servidor.use((error, peticion, respuesta, siguiente) => {
    respuesta.send(error)
});

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