import { Persona } from "./persona.model";
import { Usuario } from "./usuario.model";
import { Area } from "./area.model";

export interface Empleado {
  id: number;
  noEmpleado: string;
  puesto: string;
  cargo: string;
  persona: Persona;
  area: Area
}
