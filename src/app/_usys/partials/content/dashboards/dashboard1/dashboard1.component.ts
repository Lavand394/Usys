 import { Component, OnInit } from '@angular/core';
 import { DocumentoService } from '../../../../../_usys/core/services/modules/documento.service';
 @Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
})
export class Dashboard1Component implements OnInit {
public totalStorage;
public usedStorage;
public totalDocumentoUploaded;
public totalUsers;
public totalUsersCreated;
public filtro = '';
constructor(
  public documentoService: DocumentoService
) { }

  ngOnInit(): void {
  this.totalStorage =   JSON.parse( localStorage.getItem('svariable')).totalStorage;
  this.usedStorage =   JSON.parse( localStorage.getItem('svariable')).usedStorage;
  this.totalDocumentoUploaded =   JSON.parse( localStorage.getItem('svariable')).totalDocumentoUploaded;
  this.totalUsers =   JSON.parse( localStorage.getItem('svariable')).totalUsers;
  this.totalUsersCreated =   JSON.parse( localStorage.getItem('svariable')).totalUsersCreated;
  }
 
  busqueda(){
    this.documentoService.texto = this.filtro;
  }
}