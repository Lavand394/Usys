import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";

export interface Empleado {

  id: number;
  noEmpleado: string;
  Puesto: string;
  Cargo: string;
  idPersona: number;
  idArea: number;
  idOrganizacion: number;
}
