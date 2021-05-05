import { Empleado } from "./empleado.model";
import { Rol } from "./rol.model";
import { tipoUsuario } from "./tipoUsuario.model";

export interface Usuario{

    idUsuario: number;
    correo_Electronico: string;
    fecha_Creacion: Date;
    ultimo_Acceso: Date;
    estatus: number; // Active = 1 | Suspended = 2
    password: string;
    
}