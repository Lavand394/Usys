import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Organizacion } from '../../../../_usys/core/models/organizacion.model';
import { CustomersService } from '../../../../_usys/core/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';

const EMPTY_ORGANIZACION: Organizacion = {
  id: undefined,
  razonSocial: '',
  rfc: '',
  direccion: '',
  codigoPostal: '',
  telefono: '',
  celular: '',
  ciudad: '',
  estado: '',
  estatus: '',
  fechaCreacion: new Date(),
  rubro: '',
  web: '',
};

@Component({
  selector: 'app-edit-organizacion-modal',
  templateUrl: './edit-organizacion-modal.component.html',
  styleUrls: ['./edit-organizacion-modal.component.scss'],
  // NOTE: SE MODIFICARA FALTAN SERVICES
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditOrganizacionModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  organizacion: Organizacion;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    // esta seccion se va a cambiar cuando actualice la parte de los services
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.organizacion = EMPTY_ORGANIZACION;
      this.loadForm();
    } else {
      const sb = this.customersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ORGANIZACION);
        })
      ).subscribe((organizacion: Organizacion) => {
        this.organizacion = organizacion;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }
//Falta definir que validaciones va a llevar
  loadForm() {
    this.formGroup = this.fb.group({
      razonSocial: [this.organizacion.razonSocial, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        rfc: [this.organizacion.rfc, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
        direccion: [this.organizacion.direccion, Validators.compose([Validators.required])],
        codigoPostal: [this.organizacion.codigoPostal, Validators.compose([Validators.nullValidator])],
        telefono: [this.organizacion.telefono, Validators.compose([Validators.required])],
        celular: [this.organizacion.celular, Validators.compose([Validators.required])],
        ciudad: [this.organizacion.ciudad],
        estado: [this.organizacion.estado, Validators.compose([Validators.required])],
        fechaCreacion: [this.organizacion.fechaCreacion, Validators.compose([Validators.required])],
        rubro: [this.organizacion.rubro, Validators.compose([Validators.required])],
        web: [this.organizacion.web, Validators.compose([Validators.required])]

    });
  }

  save() {
    this.prepareOrganizacion();
    if (this.organizacion.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.customersService.update(this.organizacion).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.organizacion);
      }),
    ).subscribe(res => this.organizacion = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customersService.create(this.organizacion).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.organizacion);
      }),
    ).subscribe((res: Organizacion) => this.organizacion = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareOrganizacion() {
    const formData = this.formGroup.value;
    this.organizacion.razonSocial = formData.razonSocial;
    this.organizacion.rfc = formData.rfc;
    this.organizacion.direccion = formData.direccion;
    this.organizacion.codigoPostal = formData.codigoPostal;
    this.organizacion.telefono = formData.telefono;
    this.organizacion.celular = formData.celular;
    this.organizacion.ciudad = formData.ciudad;
    this.organizacion.estado = formData.estado;
    this.organizacion.ciudad = formData.estatus;
    this.organizacion.estado = formData.fechaCreacion;
    this.organizacion.ciudad = formData.rubro;
    this.organizacion.estado = formData.web;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
