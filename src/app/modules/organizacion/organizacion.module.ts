import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteOrganizacionModalComponent } from './components/delete-organizacion-modal/delete-organizacion-modal.component';
import { DeleteOrganizacionesModalComponent } from './components/delete-organizaciones-modal/delete-organizaciones-modal.component';
import { UpdateOrganizacionesStatusModalComponent } from './components/update-organizaciones-status-modal/update-organizaciones-status-modal.component';
import { EditOrganizacionModalComponent } from './components/edit-organizacion-modal/edit-organizacion-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizacionComponent } from './organizacion.component';

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    OrganizacionComponent,
    DeleteOrganizacionModalComponent,
    DeleteOrganizacionesModalComponent,
    UpdateOrganizacionesStatusModalComponent,
    EditOrganizacionModalComponent
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
        component: OrganizacionComponent,
      },
    ]),
  ],
  entryComponents: [
    DeleteOrganizacionModalComponent,
    DeleteOrganizacionesModalComponent,
    UpdateOrganizacionesStatusModalComponent,
    EditOrganizacionModalComponent
  ]
})
export class OrganizacionModule {}
