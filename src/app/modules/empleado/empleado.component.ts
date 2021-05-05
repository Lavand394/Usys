import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersService } from '../../_usys/core/_services/fake/empleado.service';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../_usys/crud-table';

import { DeleteCustomerModalComponent } from './components/delete-empleado-modal/delete-empleado-modal.component';
import { UpdateCustomersStatusModalComponent } from './components/update-empleado-status-modal/update-empleado-status-modal.component';
import { FetchCustomersModalComponent } from './components/fetch-empleado-modal/fetch-empleado-modal.component';
import { EditCustomerModalComponent } from './components/edit-empleado-modal/edit-empleado-modal.component';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements
OnInit,
OnDestroy,
ICreateAction,
IEditAction,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public customerService: CustomersService
) { }

// angular lifecircle hooks
ngOnInit(): void {
  this.filterForm();
  this.searchForm();
  this.customerService.fetch();
  this.grouping = this.customerService.grouping;
  this.paginator = this.customerService.paginator;
  this.sorting = this.customerService.sorting;
  const sb = this.customerService.isLoading$.subscribe(res => this.isLoading = res);
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
    filter['status'] = status;
  }

  const type = this.filterGroup.get('type').value;
  if (type) {
    filter['type'] = type;
  }
  this.customerService.patchState({ filter });
}

// search
searchForm() {
  this.searchGroup = this.fb.group({
    searchTerm: [''],
  });
  const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
    .pipe(
      /*
    The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
    we are limiting the amount of server requests emitted to a maximum of one every 150ms
    */
      debounceTime(150),
      distinctUntilChanged()
    )
    .subscribe((val) => this.search(val));
  this.subscriptions.push(searchEvent);
}

search(searchTerm: string) {
  this.customerService.patchState({ searchTerm });
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
  this.customerService.patchState({ sorting });
}

// pagination
paginate(paginator: PaginatorState) {
  this.customerService.patchState({ paginator });
}

// form actions
create() {
  this.edit(undefined);
}

edit(id: number) {
  const modalRef = this.modalService.open(EditCustomerModalComponent, { size: 'xl' });
  modalRef.componentInstance.id = id;
  modalRef.result.then(() =>
    this.customerService.fetch(),
    () => { }
  );
}

delete(id: number) {
  const modalRef = this.modalService.open(DeleteCustomerModalComponent);
  modalRef.componentInstance.id = id;
  modalRef.result.then(() => this.customerService.fetch(), () => { });
}

deleteSelected() {
  const modalRef = this.modalService.open(DeleteCustomerModalComponent);
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(() => this.customerService.fetch(), () => { });
}

updateStatusForSelected() {
  const modalRef = this.modalService.open(UpdateCustomersStatusModalComponent);
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(() => this.customerService.fetch(), () => { });
}

fetchSelected() {
  const modalRef = this.modalService.open(FetchCustomersModalComponent);
  modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  modalRef.result.then(() => this.customerService.fetch(), () => { });
}
}
