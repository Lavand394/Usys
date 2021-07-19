 import { Component, OnInit } from '@angular/core';
 import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Documento } from 'src/app/_usys/core/models/documento.model';
import { DocumentoService } from '../../../../../_usys/core/services/modules/documento.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {

public listaDocumento: Documento[];
public urlDocumentoLista;

constructor(
  public documentoService: DocumentoService,
  private modalService: NgbModal,
  private dom: DomSanitizer
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


  abrirVistaDocumento(content, url) {
    this.urlDocumentoLista = this.dom.bypassSecurityTrustResourceUrl(`http://docs.google.com/gview?url=${url}&embedded=true`); 
    this.modalService.open(content, {
        size: 'lg'
    });
  }

  public descargarDocumento(url){
    window.location.href= url;
  }
}
