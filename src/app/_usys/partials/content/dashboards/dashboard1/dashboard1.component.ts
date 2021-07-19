 import { Component, OnInit } from '@angular/core';

import { Documento } from 'src/app/_usys/core/models/documento.model';
import { DocumentoService } from '../../../../../_usys/core/services/modules/documento.service';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {

public listaDocumento: Documento[];

constructor(
  public documentoService: DocumentoService
) { }


  ngOnInit(): void {
  }


  buscarDocumentosGeneral(){
    let idOrganizacion = 2;
    let filtro = "JOSE ANTONIO";
    let apartirDe = 0;
    let mostrar = 5;

    this.documentoService.obtenerDocumentos(idOrganizacion, filtro, apartirDe, mostrar).subscribe(json => {
     this.listaDocumento = json as Documento[];
    });
  }
}
