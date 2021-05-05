import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Empleado } from '../../../../_usys/core/models/empleado.model';
import { CustomersService } from '../../../../_usys/core/_services/fake/empleado.service';


const EMPTY_CUSTOMER: Empleado = {
  id: undefined,
  Cargo: undefined,
  Puesto: undefined,
  idArea: undefined,
  idOrganizacion: undefined,
  idPersona: undefined,
  noEmpleado: undefined,
  datosPersona: undefined,
  datosUsuario: undefined
};

@Component({
  selector: 'app-fetch-empleado-modal',
  templateUrl: './fetch-empleado-modal.component.html',
  styleUrls: ['./fetch-empleado-modal.component.scss']
})
export class FetchCustomersModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  customers: Empleado[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    const sb = this.customersService.items$.pipe(
      first()
    ).subscribe((res: Empleado[]) => {
      this.customers = res.filter(c => this.ids.indexOf(c.id) > -1);
    });
    this.subscriptions.push(sb);
  }

  fetchSelected() {
    this.isLoading = true;
    // just imitation, call server for fetching data
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
