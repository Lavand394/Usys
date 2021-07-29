import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Organizacion } from '../../models/organizacion.model';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService  extends TableService<Organizacion> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<Organizacion>> {
    return this.http.get<Organizacion[]>("http://localhost:8080/api/organizacion/listar").pipe(
      map((response: Organizacion[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<Organizacion> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        console.log(result)
        return result;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
