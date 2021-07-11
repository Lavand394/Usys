import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, map, tap } from 'rxjs/operators';
import { Usuario } from '../../../../_usys/core/models/usuario.model';
import { Empleado } from '../../../../_usys/core/models/empleado.model';
import { EmpleadoService } from '../../../../_usys/core/services/modules/empleado.service';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { Rol } from 'src/app/_usys/core/models/rol.model';
import { Persona } from 'src/app/_usys/core/models/persona.model';

const EMPTY_CUSTOMER: Usuario = {
  id: undefined,
  correo: '',
  contrasenia: '',
  fechaCreacion: undefined,
  ultimoAcceso: undefined,
  estatus: 0,
  idTipoUsuario: undefined,
  idEmpleado: undefined,
  idRol: undefined
};

const EMPTY_ROl: Rol = {
  id: undefined,
  descripcion: '',
  estatus: 1,
  idOrganizacion: 1
};

const EMPTY_PERSONA: Persona = {
  id: undefined,
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  genero: undefined, // H = 1 | M = 2 | O = 3
  fechaNacimiento: undefined
}

const EMPTY_EMPLEADO: Empleado = {
  id: undefined,
  numeroEmpleado: '',
  puesto: '',
  cargo: '',
  idPersona: undefined,
  idArea: undefined
}

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
  rol: Rol;
  persona: Persona;
  empleado: Empleado;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: EmpleadoService,
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      console.log(this.id);
      this.usuario = EMPTY_CUSTOMER;
      this.persona = EMPTY_PERSONA;
      this.empleado = EMPTY_EMPLEADO;
      this.loadForm();
      
      const sb = this.customersService.getCatalogo('Rol').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((rol: Rol) => {
        console.log(rol);
        this.rol = rol;
      });
      
      /*const sb = this.customersService.getCatalogo('Rol').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((usuario: Rol) => {
        this.rol = usuario;
        
      });
      this.subscriptions.push(sb);*/
      // load catalog of roles, areas and sexual gender.
      /*const sb = this.customersService.getCatalogo('Rol').pipe(
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((catalogoRol: Rol) => {
        this.rol = catalogoRol;
        console.log(this.rol);
        this.loadForm();
      });
      this.subscriptions.push(sb);*/
      
      this.subscriptions.push(sb);
      
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
      nombre: [this.persona.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_paterno: [this.persona.apellidoPaterno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_materno: [this.persona.apellidoMaterno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      correo_electronico: [this.usuario.correo, Validators.compose([Validators.required, Validators.email])],
      contrasena: [this.usuario.contrasenia, Validators.compose([Validators.required])],
      conf_contrasena: ['', Validators.compose([Validators.required])],
      cargo: [this.empleado.cargo, Validators.compose([Validators.required])],
      puesto: [this.empleado.puesto, Validators.compose([Validators.required])],
      rol: [this.rol, Validators.compose([Validators.required])]
      /*rol: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])]*/
    }
    , {
      validator: ConfirmedValidator('contrasena', 'conf_contrasena')
    }
    );

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
    this.persona.nombre = formData.nombre;
    /*this.usuario.empleado.persona.nombre = formData.nombre;
    this.usuario.empleado.persona.apellidoPaterno = formData.apellido_paterno;
    this.usuario.empleado.persona.apellidoPaterno = formData.apellido_materno;
    this.usuario.correoElectronico = formData.correo_electronico;
    this.usuario.password = formData.contrasena;
    this.usuario.empleado.cargo = formData.cargo;
    this.usuario.empleado.puesto = formData.puesto;
    this.usuario.rol.id = formData.rol;
    this.usuario.empleado.area.id = formData.area;
    this.usuario.empleado.persona.genero = formData.genero;*/
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
