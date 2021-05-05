import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Area } from '../../../../_usys/core/models/area.model';
import { CustomersService } from '../../../../_usys/core/_services/fake/areas.service';


const EMPTY_CUSTOMER: Area = {
  id: undefined,
  descripcion: '',
  estatus: undefined
};

@Component({
  selector: 'app-fetch-area-modal',
  templateUrl: './fetch-area-modal.component.html',
  styleUrls: ['./fetch-area-modal.component.scss']
})
export class FetchCustomersModalComponent implements OnInit, OnDestroy {
  @Input() ids: number[];
  customers: Area[] = [];
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private customersService: CustomersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadCustomers();
  }
  

  loadCustomers() {
    const sb = this.customersService.items$.pipe(
      first()
    ).subscribe((res: Area[]) => {
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
