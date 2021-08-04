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
  URL: string;
  public texto = '';
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
 
// READ
findDocumentos(tableState: ITableState, fil, apa, mo): Observable<TableResponseModel<Documento>> {
  if (JSON.parse( localStorage.getItem('svariable')).userType === 1){
    this.URL = `http://localhost:8080/api/documento/buscar/${JSON.parse( localStorage.getItem('svariable')).orgID}/${fil}/${apa}/${mo}/`;
  }else if(JSON.parse( localStorage.getItem('svariable')).userType === 2){
    this.URL = `http://localhost:8080/api/documento/buscar/${JSON.parse( localStorage.getItem('svariable')).orgID}/${fil}/${apa}/${mo}/`;
  }else{
    this.URL = `http://localhost:8080/api/documento/buscar/${JSON.parse( localStorage.getItem('svariable')).orgID}/${fil}/${apa}/${mo}/`;
    console.log(this.URL)
  }
  return this.http.get<Documento[]>(this.URL).pipe(
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
  obtenerTotalDocumentos(filtro): Observable<any> {
    return this.http.get(`${environment.backend}/documento/buscar/total/${JSON.parse( localStorage.getItem('svariable')).orgID}/${filtro}/`)
    .pipe(
      map(response => response as any)
    );
  }
}
