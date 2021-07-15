import { BaseModel } from "../../crud-table";


export interface CustomEmpleadoEdit extends BaseModel {

    idPersona: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    contrasena: string;
    cargo: string;
    puesto: string;
    fechaNacimiento: Date;
    idRol: number;
    idArea: number;
    idGenero: number;

}