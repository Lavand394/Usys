import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Organizacion } from '../../../../_usys/core/models/organizacion.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { OrganizacionService } from '../../../../_usys/core/services/modules/organizacion.service';

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
  estatus: 1,
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
  modulo = 'organizacion';
  isLoading$;
  organizacion: Organizacion;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private orgService: OrganizacionService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    // esta seccion se va a cambiar cuando actualice la parte de los services
    this.isLoading$ = this.orgService.isLoading$;
    this.loadOrganizacion();
  }

  loadOrganizacion() {
    if (!this.id) {
      this.organizacion = EMPTY_ORGANIZACION;
      this.loadForm();
    } else {
      const sb = this.orgService.getItemById(this.id).pipe(
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

  loadForm() {
    this.formGroup = this.fb.group({
      razonSocial: [this.organizacion.razonSocial, Validators.compose([Validators.required,Validators.maxLength(150)])],
        rfc: [this.organizacion.rfc, Validators.compose([Validators.required, Validators.maxLength(20)])],
        direccion: [this.organizacion.direccion, Validators.compose([Validators.required, Validators.maxLength(150)])],
        codigoPostal: [this.organizacion.codigoPostal, Validators.compose([Validators.required, Validators.maxLength(10)])],
        telefono: [this.organizacion.telefono, Validators.compose([Validators.required, Validators.maxLength(50)])],
        celular: [this.organizacion.celular, Validators.compose([Validators.required, Validators.maxLength(50)])],
        ciudad: [this.organizacion.ciudad, Validators.maxLength(50)],
        estado: [this.organizacion.estado, Validators.compose([Validators.required, Validators.maxLength(50)])],
        estatus: [this.organizacion.estatus],
        fechaCreacion: [this.organizacion.fechaCreacion, Validators.compose([Validators.required])],
        rubro: [this.organizacion.rubro, Validators.compose([Validators.required, Validators.maxLength(50)])],
        web: [this.organizacion.web, Validators.compose([Validators.required, Validators.maxLength(150)])]
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
    const sbUpdate = this.orgService.update(this.organizacion).pipe(
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
    const sbCreate = this.orgService.create(this.organizacion).pipe(
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
    this.organizacion.estatus = formData.estatus;
    this.organizacion.fechaCreacion = formData.fechaCreacion;
    this.organizacion.rubro = formData.rubro;
    this.organizacion.web = formData.web;
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
