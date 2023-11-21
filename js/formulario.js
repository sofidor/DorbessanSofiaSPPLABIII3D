import { Monstruo } from "./monstruo.js";
import { crearTabla, actualizarTabla } from "./tabla.js";

const URL = "http://localhost:3000/listaMonstruos";
const $formulario = document.forms.monstruoForm;
const $seccionTabla = document.getElementById("tablaPrueba");

let listaMonstruos = []; 
document.getElementById("eliminar").addEventListener("click", ()=>{
    handlerDelete(1700587295315);
});

//  obtener la lista de monstruos desde JSON Server
async function obtenerListaMonstruos() {
    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw response;
        }

        const data = await response.json();
        listaMonstruos = data; 
        return data;
    } catch (error) {
        console.error(`Error ${error.status}: ${error.statusText}`);
        return [];
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    // Obtener la lista de monstruos desde JSON Server
    await obtenerListaMonstruos();
    // Crear la tabla con los datos obtenidos
    actualizarTabla($seccionTabla, listaMonstruos);
    calcularPromedioMiedo();    
    
});

$seccionTabla.addEventListener("click", (event) => {
    if (event.target.matches("td")) {
        const id = event.target.parentElement.dataset.id;
       
        const selectedMonstruo = listaMonstruos.find((mons) => mons.id == id);
        
        cargarFormMonstruo($formulario, selectedMonstruo);
        console.log(id);

        
        document.getElementById("eliminar").style.display = "block";
    } else if (event.target.matches("button[value='eliminar']")) {
        console.log("Valor de txtId:", $formulario.txtId.value);
        const id = parseInt($formulario.txtId.value);
        console.log("Id eliminado:", id);
        handlerDelete(id);
       
        document.getElementById("eliminar").style.display = "none";
    }
});
//Filtro por tipo
document.getElementById("btnFiltrar").addEventListener("click", () => {
    const tipoSeleccionado = document.getElementById("selectFiltroTipo").value;
    
    if (tipoSeleccionado === "Todos") {
        actualizarTabla($seccionTabla, listaMonstruos);
    } else {
        const monstruosFiltrados = listaMonstruos.filter((mons) => mons.tipo === tipoSeleccionado);
        actualizarTabla($seccionTabla, monstruosFiltrados);
    }
    calcularPromedioMiedo();
});

//promedio
function calcularPromedioMiedo() {
    const totalMiedo = listaMonstruos.reduce((sum, mons) => sum + mons.miedo, 0);
    const promedioMiedo = totalMiedo / listaMonstruos.length;   
    document.getElementById("promedioMiedo").value = promedioMiedo.toFixed(2); 
}

$formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { txtId, nombre, alias, defensa, miedo, tipo } = $formulario;

    if (txtId.value === "") {
        const newMonstruo = new Monstruo(
            Date.now(),
            nombre.value,
            alias.value,
            defensa.value,
            parseInt(miedo.value),
            tipo.value
        );

        await handlerCreate(newMonstruo);
    } else {
        const updatedMonstruo = new Monstruo(
            parseInt(txtId.value),
            nombre.value,
            alias.value,
            defensa.value,
            parseInt(miedo.value),
            tipo.value
        );
        await handlerUpdate(updatedMonstruo);
    }
   
    $formulario.reset();
   
    const updatedListaMonstruos = await obtenerListaMonstruos();
    actualizarTabla($seccionTabla, updatedListaMonstruos);
    calcularPromedioMiedo();
});
// -----------------fetch---------------------------
// async function handlerCreate(nuevoMonstruo) {
    
//     if (!validarCampo(nombre, txtNombre, 'Complete el campo nombre') ||
//         !validarCampo(alias, txtAlias, 'Complete el campo alias')) {
//         return;  // Evitar agregar el monstruo si la validación no pasa
//     }
      
//     mostrarCarga();

//     try {
        
//         const response = await fetch(URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(nuevoMonstruo),
//         });

//         if (!response.ok) {
//             throw response;
//         }
       
//         const updatedData = await obtenerListaMonstruos();    

//         setTimeout(() => {
           
//             actualizarTabla($seccionTabla, updatedData);

           
//             ocultarCarga();
//         }, 2000);
        
//         $formulario.reset();
//     } catch (error) {
//         console.error(`Error ${error.status}: ${error.statusText}`);
        
//         ocultarCarga();
//     }
// }


// async function handlerDelete(id) {   
//     mostrarCarga();
//     try {
//         const response = await fetch(URL + `/${id}`, {
//             method:"DELETE",  
//         });

//         if (!response.ok) {
//             throw response;
//         }
//         const updatedData = await obtenerListaMonstruos();        
//         listaMonstruos = updatedData;        
//         setTimeout(() => {
            
//             actualizarTabla($seccionTabla, listaMonstruos);            
//             ocultarCarga();
//         }, 2000);
//     } catch (error) {
//         console.error(`Error ${error.status}: ${error.statusText}`);       
//         ocultarCarga();
//     }
// }
// async function handlerUpdate(editMonstruo) {    
//     mostrarCarga();
//     try {        
//         const response = await fetch(`${URL}/${editMonstruo.id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(editMonstruo),
//         });

//         if (!response.ok) {
//             throw response;
//         }
        
//         const newData = await response.json();
//         setTimeout(() => {
            
//             actualizarTabla($seccionTabla, listaMonstruos);            
//             ocultarCarga();
//         }, 2000);
//     } catch (error) {
//         console.error(`Error ${error.status}: ${error.statusText}`);
//     } finally {
//         // ...
//     }
// }

 //--------------------------------AJAX-------------------------------
 function ajaxRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({ status: xhr.status, statusText: xhr.statusText });
                }
            }
        };

        xhr.open(method, url, true);

        if (method === 'POST' || method === 'PUT') {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

async function handlerCreate(nuevoMonstruo) {
    try {
        
        if (!validarCampo(nombre, txtNombre, 'Complete el campo nombre') ||
            !validarCampo(alias, txtAlias, 'Complete el campo alias')) {
            return;  
        }
       
        mostrarCarga();        
        const response = await ajaxRequest('POST', URL, nuevoMonstruo);      
        const updatedData = await obtenerListaMonstruos();

     
        setTimeout(() => {
            
            actualizarTabla($seccionTabla, updatedData);            
            ocultarCarga();
        }, 2000);

        
        $formulario.reset();
    } catch (error) {
        console.error(`Error ${error.status}: ${error.statusText}`);
        
        ocultarCarga();
    }
}

async function handlerUpdate(editMonstruo) {
    try {
        
        if (!validarCampo(nombre, txtNombre, 'Complete el campo nombre') ||
            !validarCampo(alias, txtAlias, 'Complete el campo alias')) {
            return;  
        }
       
        mostrarCarga();       
        const response = await ajaxRequest('PUT', `${URL}/${editMonstruo.id}`, editMonstruo);        
        const updatedData = await obtenerListaMonstruos();       
        setTimeout(() => {
            
            actualizarTabla($seccionTabla, updatedData);           
            ocultarCarga();
        }, 2000);
    } catch (error) {
        console.error(`Error ${error.status}: ${error.statusText}`);
      
        ocultarCarga();
    }
}

// async function handlerDelete(id) {
   
//     mostrarCarga();

//     try {       
//         const response = await ajaxRequest('DELETE', `${URL}/${id}`);        
//         const updatedData = await obtenerListaMonstruos();

//         setTimeout(() => {
           
//             actualizarTabla($seccionTabla, updatedData);          
//             ocultarCarga();
//         }, 2000);
//     } catch (error) {
//         console.error(`Error ${error.status}: ${error.statusText}`);
       
//         ocultarCarga();
//     }
// }

async function handlerDelete(id) {
    mostrarCarga();

    try {
        const response = await axios.delete(`${URL}/${id}`);
        const updatedData = await obtenerListaMonstruos();

        setTimeout(() => {
            actualizarTabla($seccionTabla, updatedData);
            ocultarCarga();
        }, 2000);
    } catch (error) {
        console.error(`Error ${error.response.status}: ${error.response.statusText}`);
        ocultarCarga();
    }
}


function cargarFormMonstruo(formulario, monstruo){
    formulario.txtId.value= monstruo.id;
    formulario.nombre.value= monstruo.nombre;
    formulario.alias.value= monstruo.alias;
    formulario.defensa.value= monstruo.defensa;
    formulario.miedo.value= monstruo.miedo;
    formulario.tipo.value= monstruo.tipo;
}


// Ubicar los elementos en el DOM
const formulario = document.querySelector('#formulario');
// Campos de texto para el usuario
const nombre = document.querySelector('input[name="nombre"]');
const alias = document.querySelector('input[name="alias"]');

// Span para mensajes de validación 
const txtNombre = document.querySelector('#txtNombre');
const txtAlias = document.querySelector('#txtAlias');

// Función de validación 
formulario.addEventListener('submit', function (evento) {
    borrarMensajes();

    let check = true;

    // Validar el campo nombre
    if (!validarCampo(nombre, txtNombre, 'Complete el campo nombre')) {
        check = false;
    }

    // Validar el campo alias
    if (!validarCampo(alias, txtAlias, 'Complete el campo alias')) {
        check = false;
    }

    if (!check) {
        evento.preventDefault(); // Evitar el envío
    }
});

function validarCampo(campo, mensajeElemento, mensajeError) {
    let dato = campo.value.trim();

    if (checkVacio(dato)) {
        mostrarMensajeError(mensajeElemento, mensajeError);
        return false;
    }

    return true;
}

function checkVacio(dato)
{
    return dato.trim() === '';
}

function borrarMensajes()
{
    ocultarMensajeError(txtNombre);
    ocultarMensajeError(txtAlias);
}

function mostrarMensajeError(elemento, mensaje)
{
    elemento.innerText = mensaje;
    elemento.style.color = 'red'; // Establecer el color a rojo
}

function ocultarMensajeError(elemento)
{
    elemento.innerText = '';
    elemento.style.color = ''; 
}

const tiposMonstruos = ['Esqueleto', 'Zombie', 'Vampiro','Fantasma','Bruja','Hombre Lobo',];
localStorage.setItem('tiposMonstruos', JSON.stringify(tiposMonstruos));

document.addEventListener('DOMContentLoaded', function () {
   
    const tiposMonstruos = JSON.parse(localStorage.getItem('tiposMonstruos')) || [];
    
    const selectMonstruos = document.getElementById('selectMonstruos');

    tiposMonstruos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        selectMonstruos.appendChild(option);
    });
});   



function mostrarCarga() {
    var loader = document.getElementById("loader");
    loader.style.display = "block";
}


function ocultarCarga() {
    var loader = document.getElementById("loader");
    loader.style.display = "none";
}




