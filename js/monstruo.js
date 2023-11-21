// Definir la clase base "Personaje"
class Personaje {
    constructor(id, nombre) {
      this.id = id;
      this.nombre = nombre;
    }
  }
  
  // Definir la clase derivada "Monstruo" que hereda de "Personaje"
  export class Monstruo extends Personaje {
    constructor(id, nombre, alias, defensa, miedo , tipo) {
      super(id, nombre);
      this.alias = alias;
      this.defensa = defensa;
      this.miedo = miedo;
      this.tipo = tipo;
    }
  }