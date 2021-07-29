import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import {
  GroupingState,
  PaginatorState,
} from '../../_usys/crud-table';
import { DocumentoService } from '../../_usys/core/services/modules/documento.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements
OnInit,
OnDestroy {
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = [];

MODULO = 'documento';
private idOrganizacion = 2;
 // VALORES DEFAUL PARA PAGINACION INICIAL
  private apartirDe = 0;
  private mostrar = 5;
  public auxNum = 1;
  public resultados = 0;
  public filtroR='';

constructor(
  private fb: FormBuilder,
  public documentoService: DocumentoService
) { }

  ngOnInit(): void {
    // Invocamos la carga que queremos mostrar segun el buscador
    this.getDocumentos();
    this.getTotalCoincidences();
    this.grouping = this.documentoService.grouping;
    const sb = this.documentoService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getTotalCoincidences(){
     this.documentoService.obtenerTotalDocumentos(this.idOrganizacion, this.documentoService.texto).subscribe(res => this.resultados = res);
  }
  getDocumentos(){
    this.documentoService.fetchDocumentos(this.MODULO, this.idOrganizacion, this.documentoService.texto, this.apartirDe, this.mostrar);
  }
  
  // PAGINACION DINAMICA
  pageChange(num: number){
    if (num === 1){
      this.apartirDe = 0;
      this.mostrar = 5;
    }
    else{
      this.mostrar = num * 5;
      this.apartirDe = this.mostrar - 5;
    }
    this.auxNum = num;
    this.getDocumentos();
  }
  
  // pagination
  paginate(paginator: PaginatorState) {
    this.documentoService.patchState({ paginator });
  }
  busquedaRapida(event){
    this.documentoService.fetchDocumentos(this.MODULO, this.idOrganizacion, this.filtroR, this.apartirDe, this.mostrar);
    this.documentoService.obtenerTotalDocumentos(this.idOrganizacion, this.filtroR).subscribe(res => this.resultados = res);
  }
}
