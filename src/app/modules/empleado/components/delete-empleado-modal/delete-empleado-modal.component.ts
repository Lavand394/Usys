import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CustomersService } from '../../../../_usys/core/_services';
import { EmpleadoService } from '../../../../_usys/core/services/modules/empleado.service';

@Component({
  selector: 'app-delete-empleado-modal',
  templateUrl: './delete-empleado-modal.component.html',
  styleUrls: ['./delete-empleado-modal.component.scss']
})
export class DeleteEmpleadoModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService,private emplService : EmpleadoService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteEmpleado() {
    this.isLoading = true;
    const sb = this.emplService.delete(this.id).pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
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
