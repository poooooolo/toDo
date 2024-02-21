require("dotenv").config()
const postgres = require("postgres")

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    })
}
function getTareas(){
    return new Promise(async (fulfill,reject)=> {
        let conexion = conectar();
        
        try{
            let tareas = await conexion`SELECT * FROM tareas`;
            conexion.end();

            fulfill(tareas);
        }catch(error){
            reject({error : "error en BBDD"});
        }
    });
}

function crearTarea({tarea}){ // extraigo la tarea de peticion.body
    return new Promise(async (fulfill,reject) => {
        let conexion = conectar();

        try{
            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`

            conexion.end();
            
            fulfill(id);

        }catch(error){
            reject({error : "error en BBDD"});
        }

    });
}

function borrarTarea(id){
    return new Promise(async(fulfill,reject)=>{
        let conexion = conectar();
        
        try{
            let {count} = await conexion `DELETE FROM tareas WHERE id = ${id}`
            conexion.end();

            fulfill(count)
        }catch(error){

            reject({error : "error en BBDD"})
        }
       
    })
}

function actualizarEstado(id){
    return new Promise(async(fulfill,reject) => {
        let conexion = conectar();
        try{
            let {count} = await conexion `UPDATE tareas SET terminada = NOT terminada  WHERE id = ${id}`
            conexion.end();
            fulfill(count);

        }catch(error){
            reject({error : "error en BBDD"})
        }
    })

}

function actualizarTexto(id,tarea){
    return new Promise(async(fulfill,reject) => {
        let conexion = conectar();
        try{
            let {count} = await conexion `UPDATE tareas SET tarea = ${tarea} WHERE id = ${id}`
            conexion.end();
            fulfill(count);

        }catch(error){
            reject({error : "error en BBDD"})
        }
    })

}

module.exports = {getTareas, crearTarea, borrarTarea, actualizarEstado, actualizarTexto};