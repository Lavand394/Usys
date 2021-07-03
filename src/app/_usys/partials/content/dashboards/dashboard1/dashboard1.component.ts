 import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs'; 
import { OrganizacionService } from '../../../../../_usys/core/services/modules/organizacion.service';

import {
  GroupingState,
  PaginatorState,
  SortState,
  ISortView,
  IFilterView,
  IGroupingView,
} from '../../../../../_usys/crud-table';
@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements
OnInit,
OnDestroy, 
ISortView,  
IGroupingView, 
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = [];
MODULO = 'organizacion'; //Cambiar cuando se integre con back a su propio modulo
constructor(
  public OrgService: OrganizacionService,//cambiar cuando se integre con back a su propio service
  private fb: FormBuilder
) { }


  // angular lifecircle hooks
  ngOnInit(): void {
    this.OrgService.fetch(this.MODULO);
    this.grouping = this.OrgService.grouping;
    this.paginator = this.OrgService.paginator;
    this.sorting = this.OrgService.sorting;
    const sb = this.OrgService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
 // filtration
 filterForm() {
  this.filterGroup = this.fb.group({
    status: [''],
    type: [''],
    searchTerm: [''],
  });
  this.subscriptions.push(
    this.filterGroup.controls.status.valueChanges.subscribe(() =>
      this.filter()
    )
  );
  this.subscriptions.push(
    this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
  );
}

filter() {
  const filter = {};
  const status = this.filterGroup.get('status').value;
  if (status) {
    filter['estatus'] = status;
  }

  const type = this.filterGroup.get('type').value;
  if (type) {
    filter['rubro'] = type;
  }
  this.OrgService.patchState({ filter });
}

  
  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.OrgService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.OrgService.patchState({ paginator });
  }
}
