import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

   

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAuthAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }

    ));
  }

  autoLogin(){
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate))

      if(loadedUser.token){
        this.user.next(loadedUser)
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime()- new Date().getTime();
        this.autoLogout(expirationDuration);
      }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAuthAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }

    ));
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.clear();
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }


  private handleError(errorResponse: HttpErrorResponse) {

    console.log("The error resopnse:", errorResponse);
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email exists. Please enter a different email!';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid Credentials';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'The email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The entered Password is Invalid.';
        break;
    }
    return throwError(errorMessage);
  }
}
