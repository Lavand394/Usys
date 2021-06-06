import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Usuario } from '../../../../_usys/core/models/usuario.model';
import { Empleado } from '../../../../_usys/core/models/empleado.model';
import { CustomersService } from '../../../../_usys/core/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';

const EMPTY_CUSTOMER: Usuario = {
  id: undefined,
  correoElectronico: undefined,
  fechaCreacion: undefined,
  ultimoAcceso: undefined,
  estatus: undefined,
  password: undefined,
  tipoUsuario: undefined,
  empleado: undefined,
  rol: undefined
};

@Component({
  selector: 'app-edit-empleado-modal',
  templateUrl: './edit-empleado-modal.component.html',
  styleUrls: ['./edit-empleado-modal.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class EditEmpleadoModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  usuario: Usuario;
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
      this.usuario = EMPTY_CUSTOMER;
      this.loadForm();
    } else {
      const sb = this.customersService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((usuario: Usuario) => {
        this.usuario = usuario;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {

    this.formGroup = this.fb.group({
      nombre: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_paterno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_materno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      correo_electronico: ['', Validators.compose([Validators.required, Validators.email])],
      contrasena: ['', Validators.compose([Validators.required])],
      conf_contrasena: ['', Validators.compose([Validators.required])],
      cargo: ['', Validators.compose([Validators.required])],
      puesto: ['', Validators.compose([Validators.required])],
      rol: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])]
    },{ 
      validator: ConfirmedValidator('contrasena', 'conf_contrasena')
    });

  }


  save() {
    this.prepareCustomer();
    if (this.usuario.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.customersService.update(this.usuario).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.usuario);
      }),
    ).subscribe(res => this.usuario = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customersService.create(this.usuario).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.usuario);
      }),
    ).subscribe((res: Usuario) => this.usuario = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.usuario.empleado.persona.nombre = formData.nombre;
    this.usuario.empleado.persona.apellidoPaterno = formData.apellido_paterno;
    this.usuario.empleado.persona.apellidoPaterno = formData.apellido_materno;
    this.usuario.correoElectronico = formData.correo_electronico;
    this.usuario.password = formData.contrasena;
    this.usuario.empleado.cargo = formData.cargo;
    this.usuario.empleado.puesto = formData.puesto;
    this.usuario.rol.id = formData.rol;
    this.usuario.empleado.area.id = formData.area;
    this.usuario.empleado.persona.genero = formData.genero;
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

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
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
