import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";
import { Area } from "./area.model";

export interface Empleado {

  id: number;
  noEmpleado: string;
  Puesto: string;
  Cargo: string;
  idPersona: number;
  area: Area;
  idOrganizacion: number;
  persona: Persona;
  usuario: Usuario;
}
