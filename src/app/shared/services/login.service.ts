import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements CanActivate {
  private _user: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this._user.asObservable();

  private loginUrl = 'https://sanger.dia.fi.upm.es/pui-rest-news/login';

  private message: string | null = null;

  private httpOptions = {
    headers: new HttpHeaders().set('Content-Type', 'x-www-form-urlencoded'),
  };

  constructor(private http: HttpClient, private router: Router) {
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      const localUser: User = JSON.parse(localStorageUser, (key, value) => {
        if (key === 'expires') {
          return new Date(value);
        }
        return value;
      });
      if (new Date() <= localUser.expires) {
        this._login(localUser);
      } else {
        localStorage.removeItem('user');
      }
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/not-found'], { skipLocationChange: true });
      return false;
    }
    return true;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  private _login(user: User): void {
    this._user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams().set('username', name).set('passwd', pwd);

    return this.http.post<User>(this.loginUrl, usereq).pipe(
      tap((user) => {
        this._login(user);
      })
    );
  }

  getUser(): User | null {
    return this._user.getValue();
  }

  logout(): void {
    localStorage.removeItem('user');
    this._user.next(null);
    this.router.navigateByUrl('');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logout();
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.debug(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
