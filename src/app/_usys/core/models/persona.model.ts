export interface Persona {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    genero: number; // H = 1 | M = 2 | O = 3
    fechaNacimiento: Date;
}