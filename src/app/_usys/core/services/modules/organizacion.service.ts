import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {

  constructor(private http: HttpClient) { 
    console.log('Servicio para organizacion, listo para ser construido')

  }

  getDatosFakePrueba(){
    this.http.get('https://api.nasa.gov/techport/api/projects/17792?api_key=DEMO_KEY')
    .subscribe(data =>{
      console.log(data);
    });
  }
}
