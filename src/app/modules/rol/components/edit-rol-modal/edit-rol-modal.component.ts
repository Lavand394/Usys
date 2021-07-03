import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Rol } from '../../../../_usys/core/models/Rol.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { RolService } from '../../../../_usys/core/services/modules/rol.service';
import { PermisosModulosByRol } from 'src/app/_usys/core/models/PermisosModulosByRol';
import { Permisos } from 'src/app/_usys/core/models/permisos.model';
import { catalogoModulo } from 'src/app/_usys/core/models/catalogoModulo';



const EMPTY_ROl: Rol = {
  id: undefined,
  descripcion: undefined,
  estatus: undefined,
  modulo: undefined,
  permisos: undefined,
  permisosModulo: undefined
};

@Component({
  selector: 'app-edit-rol-modal',
  templateUrl: './edit-rol-modal.component.html',
  styleUrls: ['./edit-rol-modal.component.scss'],
  // NOTE: SE MODIFICARA FALTAN SERVICES
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditRolModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  rol: Rol;
  permisosModulosByRol: PermisosModulosByRol;
  permisos: Permisos;
  formGroup: FormGroup;
  isChecked: true;
  arrPermisoSelect = [];
  idModuloSelect = null;
  private subscriptions: Subscription[] = [];
  constructor(
    private rolService: RolService,
    private fb: FormBuilder, public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    // esta seccion se va a cambiar cuando actualice la parte de los services
    this.isLoading$ = this.rolService.isLoading$;
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.rol = EMPTY_ROl;
      console.log('Into here');
      const sb = this.rolService.getCatalogoModulo().pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((catalogoModulo: catalogoModulo) => {
        this.rol.modulo = catalogoModulo;
        console.log(catalogoModulo);

      });
      this.subscriptions.push(sb);
      this.loadForm();
    } else {
      const sb = this.rolService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((rol: Rol) => {
        this.rol = rol;
        // obtener los permisos y modulos relacionados al id rol seleccionado:

        const sbpm = this.rolService.getModuloByRol(this.id).pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(EMPTY_ROl);
          })
        ).subscribe((catalogoModulo: catalogoModulo) => {
          this.rol.modulo = catalogoModulo;
          console.log(catalogoModulo);
        });
        this.loadForm();

        this.subscriptions.push(sbpm);
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      descripcion: [this.rol.descripcion, Validators.compose([Validators.required, Validators.maxLength(150)])],
      modulo: [null, [Validators.required]],
      permisos: [null, [Validators.required]]
    });
  }

  save() {
    this.prepareRol();
    if (this.rol.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.rolService.update(this.rol).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.rol);
      }),
    ).subscribe(res => this.rol = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.rolService.create(this.rol).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.rol);
      }),
    ).subscribe((res: Rol) => this.rol = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareRol() {
    const formData = this.formGroup.value;
    this.rol.id = formData.idRol;
    this.rol.descripcion = formData.descripcion;
    this.rol.modulo = formData.modulo;
    this.rol.permisos = formData.permisos;
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

  callPermisos(idModulo: number, idRol: number) {
    const idModuloN = Number(idModulo.toString().split(':')[1]);
    console.log(idModuloN);
    console.log(idRol);
    this.idModuloSelect = idModuloN;

    if (idRol !== undefined) {
      const sb = this.rolService.getPermisosByRolModulo(idModuloN, idRol).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((permisosModulosByRol: PermisosModulosByRol) => {

        this.rol.permisosModulo = permisosModulosByRol;
        console.log(this.rol.permisosModulo);

      });
      this.subscriptions.push(sb);
    } else {
      console.log('callPermiso new action');
      if (this.arrPermisoSelect.length !== 0) {
        console.log('exist data in json');

        for (const property in this.rol.permisosModulo) {
          const idpermiso = `${this.rol.permisosModulo[property].id}`;
          for (const objpermisosselect in this.arrPermisoSelect) {
            if (Number(`${this.arrPermisoSelect[objpermisosselect].idModulo}`) === idModuloN
              && Number(idpermiso) === Number(`${this.arrPermisoSelect[objpermisosselect].id}`)) {
                //Find index of specific object using findIndex method.    

//Log object to Console.
console.log("Before update: ", this.rol.permisosModulo[property]);

//Update object's name property.
this.rol.permisosModulo[property].habilitado = 1;

//Log object to console again.
console.log("After update: ", this.rol.permisosModulo[property]);
            }
          }
          /*if(Number(idpermiso) === Number(event.value)){
            console.log(`${this.rol.permisosModulo[property].accion}`);
            acciona =  `${this.rol.permisosModulo[property].accion}`;
            console.log(acciona);
          }*/
        } 

      } else {
        const sb = this.rolService.getCatalogoPermisos().pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(EMPTY_ROl);
          })
        ).subscribe((permisosModulosByRol: PermisosModulosByRol) => {

          this.rol.permisosModulo = permisosModulosByRol;
          console.log(this.rol.permisosModulo);

        });
      }

    }

  }

  eventCheck(event) {
    var acciona;
    if (event.checked) {
      console.log('is checked');
      console.log(JSON.stringify(this.rol.permisosModulo));
      for (const property in this.rol.permisosModulo) {
        const idpermiso = `${this.rol.permisosModulo[property].id}`;
        if (Number(idpermiso) === Number(event.value)) {
          console.log(`${this.rol.permisosModulo[property].accion}`);
          acciona = `${this.rol.permisosModulo[property].accion}`;
          console.log(acciona);
        }
      }

      var obj = { idModulo: this.idModuloSelect, id: event.value, accion: acciona, habilitado: 1 };
      this.arrPermisoSelect.push(obj);
      console.log(this.arrPermisoSelect);
    } else {
      console.log('no checked');
    }
  }

}


