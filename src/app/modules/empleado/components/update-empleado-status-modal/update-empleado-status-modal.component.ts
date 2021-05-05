import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { Empleado } from '../../../../_usys/core/models/empleado.model';
import { CustomersService } from '../../../../_usys/core/_services/fake/empleado.service';

@Component({
  selector: 'app-update-empleado-status-modal',
  templateUrl: './update-empleado-status-modal.component.html',
  styleUrls: ['./update-empleado-status-modal.component.scss']
})
export class UpdateCustomersStatusModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  status = 2;
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

  updateCustomersStatus() {
    this.isLoading = true;
    const sb = this.customersService.updateStatusForItems(this.ids, +this.status).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
