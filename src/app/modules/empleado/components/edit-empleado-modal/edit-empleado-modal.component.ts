import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Empleado } from '../../../../_usys/core/models/empleado.model';
import { CustomersService } from '../../../../_usys/core/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { Persona } from '../../../../_usys/core/models/persona.model';
import { Usuario } from 'src/app/_usys/core/models/usuario.model';

const EMPTY_CUSTOMER: Empleado = {
  id: undefined,
  Cargo: undefined,
  Puesto: undefined,
  idArea: undefined,
  idOrganizacion: undefined,
  idPersona: undefined,
  noEmpleado: undefined
};

const EMPTY_CUSTOMER_PERSONA: Persona = {
  idPersona: undefined,
  apellido_paterno: undefined,
  apellido_materno: undefined,
  fecha_Nacimiento: undefined,
  genero: undefined,
  nombre: undefined
};

const EMPTY_CUSTOMER_USUARIO: Usuario = {
  idUsuario: undefined,
  correo_Electronico: undefined,
  estatus: undefined,
  fecha_Creacion: undefined,
  password: undefined,
  ultimo_Acceso: undefined
}


@Component({
  selector: 'app-edit-empleado-modal',
  templateUrl: './edit-empleado-modal.component.html',
  styleUrls: ['./edit-empleado-modal.component.scss'],
  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will w  ant to provide your main App Module
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditCustomerModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  customer: Empleado;
  customerPersona: Persona;
  customerUsuario: Usuario;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.customer = EMPTY_CUSTOMER;
      this.customerPersona = EMPTY_CUSTOMER_PERSONA;
      this.customerUsuario = EMPTY_CUSTOMER_USUARIO;
      this.loadForm();
    } else {
      const sb = this.customersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customer: Empleado) => {
        this.customer = customer;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      nombre: [this.customerPersona.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_paterno: [this.customerPersona.apellido_paterno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_materno: [this.customerPersona.apellido_materno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      correo_electronico: [this.customerUsuario.correo_Electronico, Validators.compose([Validators.required, Validators.email])],
      contrasena: ['', Validators.compose([Validators.required])],
      conf_contrasena: ['', Validators.compose([Validators.required])],
      cargo: [this.customer.Cargo, Validators.compose([Validators.required])],
      puesto: [this.customer.Puesto, Validators.compose([Validators.required])],
      rol: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      genero: [this.customerPersona.genero, Validators.compose([Validators.required])]
    }, { 
      validator: ConfirmedValidator('contrasena', 'conf_contrasena')
    });

  }
  

  save() {
    this.prepareCustomer();
    if (this.customer.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.customersService.update(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe(res => this.customer = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customersService.create(this.customer).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.customer);
      }),
    ).subscribe((res: Empleado) => this.customer = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.customer.Cargo = formData.cargo;
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

export function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
