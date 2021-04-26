import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EmpleadoComponent } from './empleado.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EmpleadoComponent,
      },
    ]),
  ]
})
export class EmpleadoModule { }
