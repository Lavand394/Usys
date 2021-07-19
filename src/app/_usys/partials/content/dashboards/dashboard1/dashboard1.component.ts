 import { Component, OnInit } from '@angular/core';

 import { Documento } from 'src/app/_usys/core/models/documento.model';
 import { DocumentoService } from '../../../../../_usys/core/services/modules/documento.service';

 @Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {

public listaDocumento: Documento[];
public resultados: number= 0;
public auxNum: number = 1;
private idOrganizacion = 2;
public filtro = '';
private apartirDe = 0;
private mostrar = 5;
constructor(
  public documentoService: DocumentoService
) { }


  ngOnInit(): void {
  }


  buscarDocumentosGeneral(){
    console.log("click")
    console.log(this.filtro)
    this.documentoService.obtenerDocumentos(this.idOrganizacion, this.filtro, this.apartirDe, this.mostrar).subscribe(json => {
     this.listaDocumento = json as Documento[];
    });
    this.obtenerTotalDocumentos();
  }

  obtenerTotalDocumentos(){
    this.documentoService.obtenerTotalDocumentos(this.idOrganizacion, this.filtro).subscribe(json => {
      this.resultados = json ;
     });
  }
  pageChange(num: number){
    console.log(num);
    if (num === 1){
      this.apartirDe = 0;
      this.mostrar = 5;
    }
    else{
      this.mostrar = num * 5;
      this.apartirDe = this.mostrar - 5;
    }
    this.auxNum = num;
  }
}
