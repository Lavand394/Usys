import { Injectable, OnDestroy, Inject, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../crud-table';
import { Documento } from '../../models/documento.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService  extends TableService<Documento> implements OnDestroy{
  //valores default para carga inicial
 
  public texto = '';
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
 
// READ
findDocumentos(tableState: ITableState, org, fil, apa, mo): Observable<TableResponseModel<Documento>> {

  return this.http.get<Documento[]>(`${environment.backend}/documento/buscar/${org}/${fil}/${apa}/${mo}/`).pipe(
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
  obtenerTotalDocumentos(idOrganizacion, filtro): Observable<any> {
    return this.http.get(`${environment.backend}/documento/buscar/total/${idOrganizacion}/${filtro}/`).pipe(
      map(response => response as any)
    );
  }
}
