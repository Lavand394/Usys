import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableService, TableResponseModel, ITableState} from '../../../../_usys/crud-table';

import { Observable } from 'rxjs';
import { BaseModel } from '../../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class SelectService  extends TableService<any> implements OnDestroy{
  constructor(@Inject(HttpClient) http) {
    super(http);
  }
 
  getAllItems(lista: string): Observable<BaseModel> { 
    const url = `http://localhost:8080/api/${lista}/listar`;
    console.log(url)
    return this.http.get<BaseModel>(url);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
