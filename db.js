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

function crearTarea({tarea}){
    return new Promise(async (fulfill,reject) => {
        let conexion = conectar();

        try{
            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUE (${tarea}) RETURNING id`

            conexion.end();
            
            fulfill(id);

        }catch(error){
            reject({error : "bad request"});
        }

    });
}

module.exports = {getTareas, crearTarea};