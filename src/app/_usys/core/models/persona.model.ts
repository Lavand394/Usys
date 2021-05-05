export interface Persona {
    idPersona: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    genero: number; // H = 1 | M = 2 | O = 3
    fecha_Nacimiento: Date;
}