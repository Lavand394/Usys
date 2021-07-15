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
import { Area } from 'src/app/_usys/core/models/area.model';
import { Sexo } from 'src/app/_usys/core/models/sexo.model';
import { DatePipe } from '@angular/common';
import { CustomEmpleadoEdit } from 'src/app/_usys/core/models/customEmpleadoEdit.model';


const EMPTY_CUSTOMER: Usuario = {
  id: undefined,
  correo: '',
  contrasenia: '',
  fechaCreacion: new Date(),
  ultimoAcceso: undefined,
  estatus: 1,
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

const EMPTY_AREA: Area = {
  id: undefined,
  nombre: '',
  estatus: 1, // Active = 1 | Suspended = 2 | Pending = 3
  idOrganizacion: undefined
}

const EMPTY_GENERO: Sexo = {
  id: undefined,
  nombre: undefined,
  estatus: undefined
}

const EMPTY_PERSONA: Persona = {
  id: undefined,
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  idSexo: undefined, // H = 1 | M = 2 | O = 3
  fechaNacimiento: new Date()
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
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    { provide: DatePipe }
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
  area: Area;
  sexo: Sexo;
  fechaN: string;
  MODULO = 'Empleado';
  customEmpleadoEdit: CustomEmpleadoEdit;
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: EmpleadoService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {

  }



  ngOnInit(): void {
    this.isLoading$ = this.customersService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.usuario = EMPTY_CUSTOMER;
      this.persona = EMPTY_PERSONA;
      this.empleado = EMPTY_EMPLEADO;
      this.ngemptyPersona();
      this.ngemptyUsuario();
      this.ngemptyEmpleado();
      this.loadCatalogos();
      this.loadForm();
    } else {
      console.log('ID EMPLEADO: ' + this.id);
      const sb = this.customersService.getItemByIdCustomGeneral('Empleado', 'verCustomEdit', this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_CUSTOMER);
        })
      ).subscribe((customEmpleadoEdit: CustomEmpleadoEdit) => {
        this.customEmpleadoEdit = customEmpleadoEdit;
        console.log(this.customEmpleadoEdit);
        this.empleado = EMPTY_EMPLEADO;
        this.persona = EMPTY_PERSONA;
        this.usuario = EMPTY_CUSTOMER;
        this.loadCatalogos();
        this.loadDataForm();
        this.loadForm();
        this.subscriptions.push(sb);
      });


    }
  }

  loadDataForm() {
    this.empleado.puesto = this.customEmpleadoEdit.puesto;
    this.empleado.cargo = this.customEmpleadoEdit.cargo;
    this.persona.nombre = this.customEmpleadoEdit.nombre;
    this.persona.apellidoPaterno = this.customEmpleadoEdit.apellidoPaterno;
    this.persona.apellidoMaterno = this.customEmpleadoEdit.apellidoMaterno;
    this.persona.fechaNacimiento = this.customEmpleadoEdit.fechaNacimiento;
    this.usuario.correo = this.customEmpleadoEdit.correo;
    this.usuario.contrasenia = this.customEmpleadoEdit.contrasena;
    this.usuario.idRol = this.customEmpleadoEdit.idRol;
    this.empleado.idArea = this.customEmpleadoEdit.idArea;
    this.persona.idSexo = this.customEmpleadoEdit.idGenero;
  }

  loadForm() {

    this.formGroup = this.fb.group({
      correo_electronico: [this.usuario.correo, Validators.compose([Validators.required, Validators.email])],
      contrasena: [this.usuario.contrasenia, Validators.compose([Validators.required])],
      conf_contrasena: [this.usuario.contrasenia, Validators.compose([Validators.required])],
      nombre: [this.persona.nombre, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_paterno: [this.persona.apellidoPaterno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      apellido_materno: [this.persona.apellidoMaterno, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      cargo: [this.empleado.cargo, Validators.compose([Validators.required])],
      puesto: [this.empleado.puesto, Validators.compose([Validators.required])],
      rol: [this.usuario.idRol, Validators.compose([Validators.required])],
      area: [this.empleado.idArea, Validators.compose([Validators.required])],
      genero: [this.persona.idSexo, Validators.compose([Validators.required])],
      fechaNacimiento: [this.datePipe.transform(this.persona.fechaNacimiento, 'yyyy-MM-dd'), Validators.compose([Validators.required])]
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
    const sbUpdate = this.customersService.update(this.persona).pipe(
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
    this.persona.idSexo = this.sexo.id;
    this.customersService.createGeneral('Persona', this.persona).pipe(
      tap(() => {

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.persona);
      }),
    ).subscribe((persona: Persona) => {
      this.persona = persona;
      this.createEmpleado();
    });
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.persona.nombre = formData.nombre;
    this.persona.apellidoPaterno = formData.apellido_paterno;
    this.persona.apellidoMaterno = formData.apellido_materno;
    this.persona.fechaNacimiento = formData.fechaNacimiento;
    this.empleado.cargo = formData.cargo;
    this.empleado.puesto = formData.puesto;
    this.usuario.correo = formData.correo_electronico;
    this.usuario.contrasenia = formData.contrasena;
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

  loadCatalogos() {

    const sb = this.customersService.getCatalogo('Rol').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((rol: Rol) => {
      this.rol = rol;
      this.loadAreas();
    });

    this.subscriptions.push(sb);

  }

  loadAreas() {
    const sb = this.customersService.getCatalogo('Area').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((area: Area) => {
      this.area = area;
      this.loadGenero();
    });

    this.subscriptions.push(sb);
  }

  loadGenero() {
    const sb = this.customersService.getCatalogo('Sexo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((sexo: Sexo) => {
      this.sexo = sexo;
    });
    this.subscriptions.push(sb);
  }

  createEmpleado() {
    this.empleado.idPersona = this.persona.id;
    this.empleado.idArea = this.area.id;
    this.customersService.createGeneral('Empleado', this.empleado).pipe(
      tap(() => {

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.empleado);
      }),
    ).subscribe((empleado: Empleado) => {
      this.empleado = empleado;
      this.addNumEmpleado();
    });

  }

  createUsuario() {
    this.usuario.idTipoUsuario = 3;
    this.usuario.idEmpleado = this.empleado.id;
    this.usuario.idRol = this.rol.id;

    this.customersService.createGeneral('Usuario', this.usuario).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.empleado);
      }),
    ).subscribe((usuario: Usuario) => {
      this.usuario = usuario;

    });

  }

  addNumEmpleado() {
    this.customersService.addNumEmpleado('Empleado', this.empleado).pipe(
      tap(() => {

      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.empleado);
      }),
    ).subscribe((empleado: Empleado) => {
      this.empleado.numeroEmpleado = empleado.numeroEmpleado;
      this.createUsuario();
    });
  }

  ngcallGenero(idGenero: number) {
    this.sexo.id = Number(idGenero.toString().split(':')[1]);
  }

  ngcallArea(idArea: number) {
    this.area.id = Number(idArea.toString().split(':')[1]);
  }

  ngcallRol(idRol: number) {
    this.rol.id = Number(idRol.toString().split(':')[1]);
  }

  ngemptyPersona() {
    this.persona.id = undefined;
    this.persona.nombre = '';
    this.persona.apellidoPaterno = '';
    this.persona.apellidoMaterno = '';
    this.persona.idSexo = undefined; // H = 1 | M = 2 | O = 3
    this.persona.fechaNacimiento = new Date();
  }

  ngemptyUsuario() {
    this.usuario.id = undefined;
    this.usuario.correo = '';
    this.usuario.contrasenia = '';
    this.usuario.fechaCreacion = new Date();
    this.usuario.ultimoAcceso = undefined;
    this.usuario.estatus = 1;
    this.usuario.idTipoUsuario = undefined;
    this.usuario.idEmpleado = undefined;
    this.usuario.idRol = undefined;
  }

  ngemptyEmpleado() {
    this.empleado.id = undefined;
    this.empleado.numeroEmpleado = '';
    this.empleado.puesto = '';
    this.empleado.cargo = '',
      this.empleado.idPersona = undefined;
    this.empleado.idArea = undefined;
  }

  ngemptyRol() {
    this.rol.id = undefined;
    this.rol.descripcion = '';
    this.rol.estatus = 1;
    this.rol.idOrganizacion = 1;
  }

  ngemptyArea() {
    this.area.id = undefined;
    this.area.nombre = '';
    this.area.estatus = 1; // Active = 1 | Suspended = 2 | Pending = 3
    this.area.idOrganizacion = undefined;
  }

  ngemptyGenero() {
    this.sexo.id = undefined;
    this.sexo.nombre = undefined;
    this.sexo.estatus = undefined;
  }

  loadPersona() {
    const sb = this.customersService.getItemByIdCustom('Persona', this.empleado.idPersona).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_CUSTOMER);
      })
    ).subscribe((persona: Persona) => {
      this.persona = persona;
      console.log(this.persona);
      //this.loadUsuario();

    });
    this.subscriptions.push(sb);
  }

  loadUsuario() {
    /*const sb = this.customersService.getItemByIdCustomUsuario('Usuario', this.empleado.id).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_CUSTOMER);
      })
    ).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      console.log(this.usuario);
      this.loadForm();
      this.loadCatalogos();
    });
    this.subscriptions.push(sb);*/
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
