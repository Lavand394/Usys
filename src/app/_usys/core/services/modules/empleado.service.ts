import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';
import { Usuario } from '../../models/usuario.model';
import { CustomEmpleado } from '../../models/customEmpleado.models';
import { Observable } from 'rxjs';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class EmpleadoService  extends TableService<CustomEmpleado> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CustomEmpleado>> {
    return this.http.get<CustomEmpleado[]>("http://localhost:8080/api/Empleado/listarCustomEmpleado").pipe(
      map((response: CustomEmpleado[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<CustomEmpleado> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  // READ
  findCustomEmpleado(tableState: ITableState): Observable<TableResponseModel<CustomEmpleado>> {
    return this.http.get<CustomEmpleado[]>("http://localhost:8080/api/Empleado/listarCustomEmpleado").pipe(
      map((response: CustomEmpleado[]) => {
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<CustomEmpleado> = {
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
