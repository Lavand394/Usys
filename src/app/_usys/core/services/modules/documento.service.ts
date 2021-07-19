import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../crud-table';
import { Documento } from '../../models/documento.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService  extends TableService<Documento> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Documento>> {
    return this.http.get<Documento[]>("http://localhost:8080/api/documento/").pipe(
      map((response: Documento[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Documento> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  obtenerDocumentos(idOrganizacion, filtro, apartirDe, mostrar): Observable<Documento[]> {
    return this.http.get(`http://localhost:8080/api/documento/buscar/${idOrganizacion}/${filtro}/${apartirDe}/${mostrar}/`).pipe(
      map(response => response as Documento[])
    );
  }

  obtenerTotalDocumentos(idOrganizacion, filtro): Observable<any> {
    return this.http.get(`http://localhost:8080/api/documento/buscar/total/${idOrganizacion}/${filtro}/`).pipe(
      map(response => response as any)
    );
  }
}
