import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Rol } from '../../../../_usys/core/models/Rol.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { RolService } from '../../../../_usys/core/services/modules/rol.service';
import { Permisos } from 'src/app/_usys/core/models/permisos.model';
import { catalogoModulo } from 'src/app/_usys/core/models/catalogoModulo';

const EMPTY_ROl: Rol = {
  id: undefined,
  descripcion: '',
  estatus: 1,
  idOrganizacion: 1
};

const EMPTY_MODULO: catalogoModulo = {
  id: undefined,
  idRol: undefined,
  idPermiso: undefined,
  idModulo: undefined,
  accionPermiso: '',
  estatusPermiso: 0,
  modulo: ''
}

const EMTY_PERMISOS: Permisos = {
  id: undefined,
  idRol: undefined,
  idPermiso: undefined,
  idModulo: undefined,
  accionPermiso: '',
  estatusPermiso: 1, // Active = 1 | Inactive = 2
  modulo: '',
  habilitado: undefined,
  idIntermedio: undefined
}

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
  catalogoModulo: catalogoModulo;
  //permisosModulosByRol: PermisosModulosByRol;
  permisos: Permisos;
  formGroup: FormGroup;
  isChecked: true;
  arrPermisoSelect;
  idModuloSelect = null;
  MODULO = 'Rol';
  disabled = true;
  disabledButtonSave = true;
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
    if (this.id) {
      const sb = this.rolService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ROl);
        })
      ).subscribe((rol: Rol) => {
        this.rol = rol;
        this.loadForm();
        this.subscriptions.push(sb);
        this.disabled = true;
        this.disabledButtonSave = false;
        this.loadCatalogoModulos();
      });

    } else {

      console.log('acction new.');
      this.rol = EMPTY_ROl;
      this.catalogoModulo = EMPTY_MODULO;
      this.disabled = false;
      this.disabledButtonSave = true;
      this.ngchangeHeight();
      this.loadForm();

    }
  }

  loadForm() {

    this.formGroup = this.fb.group({
      descripcion: [this.rol.descripcion, Validators.compose([Validators.required, Validators.maxLength(150)])],
      modulo: [this.catalogoModulo, Validators.compose([Validators.required])]
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
    console.log(this.rol);
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

  savePermiso(action, idIntermedio) {
    if (action === 'habilita') {
      console.log(this.arrPermisoSelect);
      const sbCreate = this.rolService.createPermisoCheck('IntPermisoModulo', this.arrPermisoSelect).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrPermisoSelect);
        }),
      ).subscribe((res: Permisos) => {
        console.log(res);
        this.arrPermisoSelect = res;
        console.log(this.arrPermisoSelect);
        this.ngupdatedPermisoCheck(action);
      });
     
    } else if (action === 'desahabilita') {
      const sbCreate = this.rolService.deleteItemsPermisoCheck('IntPermisoModulo', idIntermedio).pipe(
        tap(() => {

        }),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.arrPermisoSelect);
        }),
      ).subscribe((res: Permisos) => {
        console.log(res);
        this.arrPermisoSelect = res;
        console.log(this.arrPermisoSelect);
        this.ngupdatedPermisoCheck(action);
      });
    }

  }

  private prepareRol() {
    const formData = this.formGroup.value;
    this.rol.id = formData.idRol;
    this.rol.descripcion = formData.descripcion;
    this.catalogoModulo = formData.modulo;
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

  ngcallPermisos(idModulo: number) {
    const idModuloN = Number(idModulo.toString().split(':')[1]);
    this.idModuloSelect = idModuloN;
    const sb = this.rolService.getPermisosByRolModulo(idModuloN, this.rol.id, 'CatalogoPermiso' + '/verPermisosPorRolModulo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMTY_PERMISOS);
      })
    ).subscribe((permisosModulosByRol: Permisos) => {
      console.log(permisosModulosByRol);
      this.permisos = permisosModulosByRol;
    });
  }

  ngcheckPermiso(event) {

    let acciona;
    let idIntermedio;
    for (const property in this.permisos) {
      const idpermiso = `${this.permisos[property].idPermiso}`;
      if (Number(idpermiso) === Number(event.value)) {
        acciona = `${this.permisos[property].accion}`;
        idIntermedio = `${this.permisos[property].id}`;
      }
    }

    if (event.checked) {
      console.log('is checked');
      var obj = { idModulo: this.idModuloSelect, idPermiso: event.value, accion: acciona, habilitado: 1, idIntermedia: idIntermedio, idRol: this.rol.id };
      this.arrPermisoSelect = obj;
      console.log(this.arrPermisoSelect);
      this.savePermiso('habilita',idIntermedio);

    } else {

      console.log('no checked');
      var obj = { idModulo: this.idModuloSelect, idPermiso: event.value, accion: acciona, habilitado: 0, idIntermedia: idIntermedio, idRol: this.rol.id };
      this.arrPermisoSelect = obj;
      console.log(this.arrPermisoSelect);
      this.savePermiso('desahabilita',idIntermedio);
    }

  }

  ngchangeHeight() {
    (document.querySelector('.modal-body') as HTMLElement).style.minHeight = '150px';
  }

  loadCatalogoModulos() {
    const sb = this.rolService.getCatalogoModulo('CatalogoModulo').pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(EMPTY_ROl);
      })
    ).subscribe((catalogoModulo: catalogoModulo) => {
      this.catalogoModulo = catalogoModulo;
      console.log(catalogoModulo);
      this.loadForm();
    });
  }

  ngupdatedPermisoCheck(action) {


    for (const property in this.permisos) {
      const idpermiso = `${this.permisos[property].id}`;
      for (const objpermisosselect in this.arrPermisoSelect) {
        if (Number(idpermiso) === Number(`${this.arrPermisoSelect[objpermisosselect].idPermiso}`)) {
          //Find index of specific object using findIndex method.    

          //Log object to Console.
          console.log("Before update: ", this.permisos[property]);

          if (action === 'habilita') {
            //Update object's name property.
            this.permisos[property].id = Number(`${this.arrPermisoSelect[objpermisosselect].idIntermedio}`);

          } else if (action === 'desahabilita') {
            //Update object's name property.
            this.permisos[property].id = 0;

          }

          //Log object to console again.
          console.log("After update: ", this.permisos[property]);
        }
      }
    }



  }

}


