import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Usuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class EmpleadoService  extends TableService<Usuario> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Usuario>> {
    return this.http.get<Usuario[]>("http://localhost:8080/api/usuario/listar").pipe(
      map((response: Usuario[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Usuario> = {
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
}
