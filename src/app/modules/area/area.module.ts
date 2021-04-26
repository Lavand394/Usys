import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteCustomerModalComponent } from './components/delete-customer-modal/delete-customer-modal.component';
import { DeleteCustomersModalComponent } from './components/delete-customers-modal/delete-customers-modal.component';
import { FetchCustomersModalComponent } from './components/fetch-customers-modal/fetch-customers-modal.component';
import { UpdateCustomersStatusModalComponent } from './components/update-customers-status-modal/update-customers-status-modal.component';
import { EditCustomerModalComponent } from './components/edit-customer-modal/edit-customer-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AreaComponent } from './area.component';



@NgModule({
  declarations: [
    AreaComponent,
    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    FetchCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    EditCustomerModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: AreaComponent,
      },
    ]),
  ],
  entryComponents: [
    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    FetchCustomersModalComponent,
    EditCustomerModalComponent
  ]
})
export class AreaModule { }
