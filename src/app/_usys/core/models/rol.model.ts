
export interface Rol{

    id: number;
    descripcion: string;
    estatus: number; // Active = 1 | Inactive = 2
    modulo: object;
    permisos: object;
    permisosModulo: object;
}