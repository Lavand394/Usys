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
    console.log("ENTROOOOOOOOOOOOOOO");
    this.documentoService.obtenerDocumentos("JOSE ANTONIO").subscribe(json => {
      console.log("ENTROOOOOOOOOOOOOOO 2");
     this.listaDocumento = json as Documento[];
     console.log("ENTROOOOOOOOOOOOOOO 3");
    });
  }
}
