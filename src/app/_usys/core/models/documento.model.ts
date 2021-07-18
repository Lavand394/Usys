import { Metadatos } from './metadatos.model';

export interface Documento
{
  idDocumento: number;
  nombreDocumento: string;
  tamanio: string;
  url: string;
  fechaCreacion: string;
  idOrganizacion: number;
  tipo: string;
  idArea: number;
  nombreArea: string;
  totalMetadatos: number;
  metadatos: Metadatos;
}
