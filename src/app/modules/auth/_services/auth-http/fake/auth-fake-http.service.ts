import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { UserModel } from '../../../_models/user.model';
import { AuthModel } from '../../../_models/auth.model';
import { UsersTable } from '../../../../../_fake/fake-db/users.table';
import { environment } from '../../../../../../environments/environment';
import { BaseModel } from '../../../../../../app/_usys/crud-table/models/base.model';
import { DatosSession } from '../../../_models/datos-session.model';



@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {

 
  // Private fields
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _errorMessage = new BehaviorSubject<string>('');

  public idOrganizacion;
  public idTipoUsuario;
  public idUsuario;
  public idDirectorio: object;
  public directoriotexto: string;
  public totalStorage;
  public usedStorage;
  public totalDocumentoUploaded;
  public totalUsers;
  public totalUsersCreated;
  protected http: HttpClient;
  API_URL1 = environment.backend;
  API_URL = `${environment.apiUrl}/users`;
  MODAL = '';
  constructor(http: HttpClient) {
    this.http = http;
  }


  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.validarSession('Usuario', email, password).pipe(
      map((result: DatosSession) => {
       

        if (result === null) {
          return notFoundError;
        }
        
        this.idOrganizacion = result.idOrganizacion;
        this.idTipoUsuario = result.idTipoUsuario;
        this.idUsuario = result.idUsuario;
        this.obtenerTotalStorage(result.idOrganizacion).subscribe();
        this.obtenerUsedStorage(result.idOrganizacion).subscribe();
        this.obtenerTotalDocumentsUploaded(result.idOrganizacion).subscribe();
        this.obtenerTotalUsers(result.idOrganizacion).subscribe();
        this.obtenerTotalUsersCreated(result.idOrganizacion).subscribe();


        this.getDirectorios('Usuario',result.idRol).pipe(
        
          catchError((errorMessage) => {
            return of(null);
          })
        ).subscribe((objectDirectorios: object) => {
          
          this.idDirectorio = objectDirectorios;
          this.directoriotexto = this.idDirectorio.toString();
           
          
          const svariable = {
            orgID: result.idOrganizacion,
            userType: result.idTipoUsuario,
            userID: result.idUsuario,
            directory: this.directoriotexto,
            totalStorage: this.totalStorage,
            usedStorage: this.usedStorage,
            totalDocumentoUploaded :  this.totalDocumentoUploaded,
            totalUsers:  this.totalUsers,
            totalUsersCreated: this.totalUsersCreated
                    }
                    console.log(svariable)
          localStorage.setItem('svariable', JSON.stringify(svariable));
        });


        

       /* this.validarSession('Usuario', email, password).pipe(
          catchError((errorMessage) => {
            return of(undefined);
          })
        ).subscribe((datosSession: DatosSession) => {
         
          this.idOrganizacion = datosSession.idOrganizacion;
          
        });*/


        const auth = new AuthModel;
        auth.accessToken = 'access-token-8f3ae836da744329a6f93bf20594b5cc';
        auth.refreshToken = 'access-token-f8c137a2c98743f48b643e71161d90aa';
        auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
        return auth;
       
      })
    );
  }

  // public methods
  /*login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    this.validarSession('Usuario', email, password).pipe(
      catchError((errorMessage) => {
        return of(undefined);
      })
    ).subscribe((datosSession: DatosSession) => {

      //this.idOrganizacion = datosSession.idOrganizacion;
      const auth = new AuthModel;
      auth.accessToken = 'access-token-8f3ae836da744329a6f93bf20594b5cc';
      auth.refreshToken = 'access-token-f8c137a2c98743f48b643e71161d90aa';
      auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
      return auth;
    });

  }*/

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.accessToken = 'access-token-' + Math.random();
    user.refreshToken = 'access-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(this.API_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel> {
    const user = UsersTable.users.find((u) => {
      return u.accessToken === token;
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.API_URL);
  }

  validarSession(modulo, email: string, password: string): Observable<DatosSession> {
    const url = `${this.API_URL1}/${modulo}/validarSession/${email}/${password}`;
    return this.http.get<DatosSession>(url);
    /*this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL1}${modulo}/validarSession/${email}/${password}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );*/
  }

  getDirectorios(modulo, idrol: number): Observable<object> {
    const url = `${this.API_URL1}/${modulo}/obtenerDirectorios/${idrol}`;
    return this.http.get<object>(url);
  }
  
  obtenerTotalStorage(organizacion): Observable<any> {
    return this.http.get(`${environment.backend}/ParametroOrganizacion/espacioDisponible/${organizacion}`)
    .pipe(
      map(response => {
        response as any;
        this.totalStorage = response;
      })
    );
  }
  obtenerUsedStorage(organizacion): Observable<any> {
    console.log(`${environment.backend}/documento/espacioOcupado/${organizacion}`)
    return this.http.get(`${environment.backend}/documento/espacioOcupado/${organizacion}`)
    .pipe(
      map(response => {
        response as any;
        this.usedStorage = response;
      })
    );
  }
  obtenerTotalDocumentsUploaded(organizacion): Observable<any> {
    return this.http.get(`${environment.backend}/documento/totalDocumentos/${organizacion}`)
    .pipe(
      map(response => {
        response as any;
        this.totalDocumentoUploaded = response;
      })
    );
  }
  obtenerTotalUsers(organizacion): Observable<any> {
    return this.http.get(`${environment.backend}/ParametroOrganizacion/usuariosDisponible/${organizacion}`)
    .pipe(
      map(response => {
        response as any;
        this.totalUsers = response;
      })
    );
  }
  obtenerTotalUsersCreated(organizacion): Observable<any> {
    return this.http.get(`${environment.backend}/Usuario/totalUsuariosOcupados/${organizacion}`)
    .pipe(
      map(response => {
        response as any;
        this.totalUsersCreated = response;
      })
    );
  }
}

