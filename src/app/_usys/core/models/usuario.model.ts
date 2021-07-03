import { Empleado } from "./empleado.model";
import { Rol } from "./rol.model";
import { tipoUsuario } from "./tipoUsuario.model";

export interface Usuario{
    id: number;
    correoElectronico: string;
    fechaCreacion: Date;
    ultimoAcceso: Date;
    estatus: number; // Activo = 1 | Suspendido = 2
    password: string;
    tipoUsuario: tipoUsuario;
    empleado: Empleado;
    rol: Rol;
    numeroEmpleado: string; 
}