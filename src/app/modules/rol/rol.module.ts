import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from '../../_usys/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteRolModalComponent } from './components/delete-rol-modal/delete-rol-modal.component';
import { EditRolModalComponent } from './components/edit-rol-modal/edit-rol-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RolComponent } from './rol.component';

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    RolComponent,
    DeleteRolModalComponent,
    EditRolModalComponent
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
        component: RolComponent,
      },
    ]),
  ],
  entryComponents: [
    //DeleteOrganizacionModalComponent,
    //EditOrganizacionModalComponent
  ]
})
export class RolModule {}
