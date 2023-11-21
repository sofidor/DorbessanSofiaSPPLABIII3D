async function obtenerMonstruosDesdeServidor() {
    const URL = "http://localhost:3000/listaMonstruos";

    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw response;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error ${error.status}: ${error.statusText}`);
        return [];
    }
}

async function mostrarMonstruos() {   
    const listaMonstruos = await obtenerMonstruosDesdeServidor();    
    const contenedorMonstruos = document.getElementById("contenedorMonstruos") || crearContenedorMonstruos();    
    contenedorMonstruos.innerHTML = "";

    // Crea tarjetas para cada monstruo y agrégales al contenedor
    listaMonstruos.forEach((monstruo) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card", "m-2", "text-center", "monstruo-card");
        tarjeta.innerHTML = `
        <div class="card-header">${monstruo.nombre}</div>
        <div class="card-body">                 
            <div class="monstruo-texto">
                <p class="card-text">
                <img src="../img/monstruo.png" class="icono">Alias: ${monstruo.alias}
                </p>
                <p class="card-text">
                <img src="../img/monstruo (2).png" class="icono"> Tipo: ${monstruo.tipo}
                </p>
                <p class="card-text">
                <img src="../img/fantasma (1).png" class="icono"> Miedo: ${monstruo.miedo}
                </p>
                <p class="card-text">
                <img src="../img/escudo-seguro.png" class="icono"> Defensa: ${monstruo.defensa}
                </p>
            </div>
        </div>
        `;
        contenedorMonstruos.appendChild(tarjeta);
    });
}
mostrarMonstruos();