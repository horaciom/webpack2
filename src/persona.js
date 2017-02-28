export default class Persona {
    constructor(nombre) {
        this.nombre = nombre;
    }

    saluda() {
       return this.nombre;
    }
}