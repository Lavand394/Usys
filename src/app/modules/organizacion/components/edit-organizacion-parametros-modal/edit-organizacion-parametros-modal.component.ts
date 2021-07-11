import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { ParametroOrganizacion } from '../../../../_usys/core/models/parametro-organizacion.model';
import { ParametroOrganizacionService } from '../../../../_usys/core/services/modules/parametro-organizacion.service';
const EMPTY_ORGANIZACION: ParametroOrganizacion = {
  id: undefined,
  espacio: 0,
  limiteUsuario: 0,
  estatus: 0,
  idOrganizacion: 1,
};
@Component({
  selector: 'app-edit-organizacion-parametros-modal',
  templateUrl: './edit-organizacion-parametros-modal.component.html',
  styleUrls: ['./edit-organizacion-parametros-modal.component.scss']
})
export class EditOrganizacionParametrosModalComponent implements OnInit , OnDestroy {
  @Input() id: number;
  MODULO = 'ParametroOrganizacion';
  isLoading$;
  pOrganizacion: ParametroOrganizacion;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private pOrgService: ParametroOrganizacionService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    // esta seccion se va a cambiar cuando actualice la parte de los services
    this.isLoading$ = this.pOrgService.isLoading$;
    this.loadParametroOrganizacion();
  }

  loadParametroOrganizacion() {
    if (!this.id) {
    this.pOrganizacion = EMPTY_ORGANIZACION;
    this.loadForm();
    } else {
      const sb = this.pOrgService.getItemByIdParametroOrganizacion(this.id, this.MODULO + '/ver/organizacion').pipe(
        first(),
        catchError((errorMessage) => {
          console.log(errorMessage)
          this.modal.dismiss(errorMessage);
          return of(EMPTY_ORGANIZACION);
        })
      ).subscribe((parametroO: ParametroOrganizacion) => {
        this.pOrganizacion = parametroO;
        console.log(this.pOrganizacion)
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    console.log(this.pOrganizacion.espacio)
    this.formGroup = this.fb.group({
      espacio: [this.pOrganizacion.espacio, Validators.compose([Validators.required,Validators.maxLength(5)])],
      limiteUsuario: [this.pOrganizacion.limiteUsuario, Validators.compose([Validators.required, Validators.maxLength(5)])],
      estatus: [this.pOrganizacion.estatus, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareOrganizacion();
    if (this.pOrganizacion.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.pOrgService.update(this.pOrganizacion).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.pOrganizacion);
      }),
    ).subscribe(res => this.pOrganizacion = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.pOrgService.create(this.pOrganizacion).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.pOrganizacion);
      }),
    ).subscribe((res: ParametroOrganizacion) => this.pOrganizacion = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareOrganizacion() {
    const formData = this.formGroup.value;
    this.pOrganizacion.espacio = formData.espacio;
    this.pOrganizacion.limiteUsuario = formData.limiteUsuario;
    this.pOrganizacion.estatus = formData.estatus;
    this.pOrganizacion.idOrganizacion = formData.idOrganizacion;
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
