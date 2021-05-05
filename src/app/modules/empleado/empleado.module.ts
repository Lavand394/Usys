import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteCustomerModalComponent } from './components/delete-empleado-modal/delete-empleado-modal.component';
import { UpdateCustomersStatusModalComponent } from './components/update-empleado-status-modal/update-empleado-status-modal.component';
import { EditCustomerModalComponent } from './components/edit-empleado-modal/edit-empleado-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpleadoComponent } from './empleado.component';

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    EmpleadoComponent,
    DeleteCustomerModalComponent,
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
        component: EmpleadoComponent,
      },
    ]),
  ],
  entryComponents: [
    DeleteCustomerModalComponent,
    UpdateCustomersStatusModalComponent,
    EditCustomerModalComponent
  ]
})
export class EmpleadoModule {}