import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { Rol } from '../../../../_usys/core/models/Rol.model';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_usys/core';
import { RolService } from '../../../../_usys/core/services/modules/rol.service';

const EMPTY_ROl: Rol = {
  id: undefined,
  datosOrganizacion: undefined,
  descripcion: undefined,
  estatus: undefined
};

@Component({
  selector: 'app-edit-rol-modal',
  templateUrl: './edit-rol-modal.component.html',
  styleUrls: ['./edit-rol-modal.component.scss'],
  // NOTE: SE MODIFICARA FALTAN SERVICES
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditRolModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  rol: Rol;
  formGroup: FormGroup;
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
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      descripcion: ['', Validators.compose([Validators.required,Validators.maxLength(150)])],
      modulo: ['', Validators.compose([Validators.required])]
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
