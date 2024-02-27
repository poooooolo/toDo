//este archivo es la "aplicacion"
const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const input = document.querySelector('form input[type="text"]');

// ir al back a ver si hay tareas
fetch("/api-to-do") 
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas); //por cada una de las tareas, creamos una tarea en el front
    });
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    
    if(/^[a-záéíóúüñ][a-záéíóúüñ0-9 ]*$/i.test(input.value)){
        return fetch("/api-to-do/crear",{
            method : "POST",
            body : JSON.stringify({tarea : input.value}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id}) => {//me retorna el id

            if(id){//si hay id
                new Tarea(id,input.value.trim(),false,contenedorTareas);//crear una nueva tarea, es un objeto (id,tarea,estado,contenedorTareas)

                return input.value =""
            }console.log("mal escrito")
        })
    }      
})



