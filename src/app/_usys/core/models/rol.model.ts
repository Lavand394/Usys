import { Organizacion } from "./organizacion.model";

export interface Rol{

    id: number;
    descripcion: string;
    estatus: number; // Active = 1 | Inactive = 2
    datosOrganizacion: Organizacion;
    
}