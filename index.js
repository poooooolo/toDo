require("dotenv").config();
const express = require("express");
const {json} = require("body-parser")
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto} = require("./db");

const servidor = express();

servidor.use(json());//cualquier cosa que venga con content-type json es procesado por body-parser, 
                    //toda petición pasa por aquí porque no tiene ninguna url

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
            try{
                let id = await crearTarea({tarea})
                return respuesta.json({id})

            }catch(error){
                respuesta.status(500);
                return respuesta.json(error);
            }
        }

        siguiente({error: "falta el argumento tarea en el objeto JSON"})
        // throw "no me has enviado una tarea",si cae aqui lo lanza al último middleware use

    // console.log(peticion.body) el body del fetch

   
});

servidor.put("/api-to-do/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta) => {
    let operacion = Number(peticion.params.operacion);

    let operaciones = [actualizarTexto,actualizarEstado];

    let {tarea} = peticion.body;

    if(operacion == 1 && (!tarea || tarea.trim() == "")){
        return siguiente({ error : "falta el argumento tarea en el objeto JSON" }); 
    }

    try{
        let cantidad = await operaciones[operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);
        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.delete("/api-to-do/borrar/:id([0-9]+)",async (peticion,respuesta) => {

        try{
            let cantidad = await borrarTarea(peticion.params.id)
            return respuesta.json({resultado : cantidad ? "ok" : "ko"})

        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }

);

servidor.use((petición,respuesta) => { //es el middleware por defecto
    respuesta.status(404)
    respuesta.json({error : "not found"})
})


servidor.use((error, peticion, respuesta, siguiente) => {
    respuesta.status(400) //bad request, es decir, has hecho una petición no válida
    respuesta.json({error : "petición no válida"});

});

servidor.listen(process.env.PORT);//las variables de entorno sivern para guardar datos sensibles como la BBDD contraseñas etc

//el put verifica si lo que cambiamos es diferente, patch es una orden directa

//punto de entrada con GET /api-todo
//si nos hacen una petición POST a /api-todo/crear peticion : {tarea : "texto"} respuesta : {id}

//DELETE /api-todo/borrar/:id

//PUT a /api-todo/actualizar/:id/:operacion

//operacion 1 -> editar texto -> peticion { tarea : "texto nuevo"}
//operación 2 -> toggle estado

// respuesta: [{id,tarea,terminada}] o respuesta {"error en servidor"}500
// respuesta: {"error en la petición"}400
// respuesta: {"error not found"}404