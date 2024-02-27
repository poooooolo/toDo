//representa el js que crea el html, gestiona las llamadas a ayax etc

class Tarea{//representa en memoria RAM cada una de las tareas
    constructor(id,textoTarea,estado,contenedor){
        this.id = id;
        this.textoTarea = textoTarea;
        this.DOM = null;//componente HTML null porque no lo voy a crear aquí
        this.editando = false;
        this.crearComponente(estado,contenedor);
    }//cada this.algo representa una propiedad del objeto
    crearComponente(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //texto
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.textoTarea;

        //input
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type", "text");
        inputTarea.value = this.textoTarea;

        //botonEditar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";
        
        botonEditar.addEventListener("click", () => this.editarTarea());

        //botonBorrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click", () => this.borrarTarea());


        //botonEstado
        let botonEstado = document.createElement("button");
        botonEstado.classList.add("estado", estado ? "terminada" : null);
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.toggleEstado().then(({resultado}) => { //retorna una promesa que se cumple directamente
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada")
                }
                console.log("error al actualizar")
            });
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(inputTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);       

        contenedor.appendChild(this.DOM);
    }
    //metodos
    borrarTarea(){
        fetch("/api-to-do/borrar/" + this.id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado})=> {
            if(resultado == "ok"){
                return this.DOM.remove();//lo eliminamos del HTML
            }
            console.log("error al borrar");
        });

    }
    toggleEstado(){
        return fetch(`/api-to-do/actualizar/${this.id}/2`,{
            method : "PUT"
        })
        .then(respuesta => respuesta.json())
    }//cuando tengamos backend se llamará
    async editarTarea(){

        if(this.editando){//este condicional es un toggle explícito
            //guardar
            let textoTemporal = this.DOM.children[1].value;

            if(textoTemporal.trim() != "" && textoTemporal.trim() != this.textoTarea){
                let {resultado} = await fetch(`/api-to-do/actualizar/${this.id}/1`,{
                                            method : "PUT",
                                            body : JSON.stringify({ tarea : textoTemporal.trim() }),
                                            headers : {
                                                "Content-type" : "application/json"
                                            }
                                        })
                                        .then(respuesta => respuesta.json());
                if(resultado == "ok"){
                    this.textoTarea = textoTemporal;
                }                    
            }
            
            this.DOM.children[0].innerText = this.textoTarea;//el usuario lo ha editado
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[2].innerText = "editar";
            this.editando = false;

        }else{
            //editar
            this.DOM.children[0].classList.remove("visible");//h2
            this.DOM.children[1].value = this.textoTarea;//input
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";//boton editar lo cambiamos por guardar
            this.editando = true;
        }
    }
}
