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


const EMPTY_CUSTOMER: Usuario = {
  id: undefined,
  correo: '',
  contrasenia: '',
  fechaCreacion: new Date(),
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
  area: Area;
  sexo: Sexo;
  myDate = new Date();
  
  private subscriptions: Subscription[] = [];
  constructor(
    private customersService: EmpleadoService,
    private fb: FormBuilder, public modal: NgbActiveModal
  ) {
    
   }



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
      this.loadCatalogos();
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
      conf_contrasena: [this.usuario.contrasenia, Validators.compose([Validators.required])],
      cargo: [this.empleado.cargo, Validators.compose([Validators.required])],
      puesto: [this.empleado.puesto, Validators.compose([Validators.required])],
      rol: [this.rol, Validators.compose([Validators.required])],
      area: [this.area, Validators.compose([Validators.required])],
      genero: [this.sexo, Validators.compose([Validators.required])],
      fechaNacimiento: [this.persona.fechaNacimiento, Validators.compose([Validators.required])]
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
    console.log(this.sexo.id);
    this.persona.genero = this.sexo.id;
    const sbCreate = this.customersService.createGeneral('Persona',this.persona).pipe(
      tap(() => {
        //this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.persona);
      }),
    ).subscribe((persona: Persona) => {
      this.persona = persona;
      this.createEmpleado();
    });
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

  loadCatalogos() {

    const sb = this.customersService.getCatalogo('Rol').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((rol: Rol) => {
      console.log(rol);
      this.rol = rol;
      //console.log('area');
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
      console.log(area);
      this.area = area;
      console.log('genero');
      this.loadGenero();
    });

    this.subscriptions.push(sb);
  }

  loadGenero(){
    const sb = this.customersService.getCatalogo('Sexo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((sexo: Sexo) => {
      console.log(sexo);
      this.sexo = sexo;
      console.log('genero');
    });

    this.subscriptions.push(sb);
  }

  createEmpleado(){
    this.empleado.idPersona = this.persona.id;
    this.empleado.idArea = this.area.id;
    const sbCreate = this.customersService.createGeneral('Empleado',this.empleado).pipe(
      tap(() => {
        //this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.empleado);
      }),
    ).subscribe((empleado: Empleado) => {
      this.empleado = empleado;
      this.createUsuario();
    });
    this.subscriptions.push(sbCreate);
  }

  createUsuario(){
    this.usuario.idTipoUsuario = 3;
    this.usuario.idEmpleado = this.empleado.id;
    this.usuario.idRol = this.rol.id;
   
    const sbCreate = this.customersService.createGeneral('Usuario',this.usuario).pipe(
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
    this.subscriptions.push(sbCreate);
  }

  ngcallGenero(idGenero: number) {
    this.sexo.id = Number(idGenero.toString().split(':')[1]);
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
