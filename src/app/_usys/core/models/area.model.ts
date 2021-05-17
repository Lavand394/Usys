import { BaseModel } from '../../../_usys/crud-table';

export interface Area
{
  id: number;
  descripcion: string;
  estatus: number; // Active = 1 | Suspended = 2 | Pending = 3
}
