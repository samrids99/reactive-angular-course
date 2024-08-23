import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, share, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = "auth_data"; // this is the key for the local storage

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);

    user$: Observable<User> = this.subject.asObservable();
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

        const user = localStorage.getItem(AUTH_DATA);

        if (user) {
            this.subject.next(JSON.parse(user)); // creates an in memory user object and updates user observable
        }
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>('api/login', { email, password }) // here email and password is a json payload
            .pipe(
                tap(user => {
                    this.subject.next(user);
                    localStorage.setItem(AUTH_DATA, JSON.stringify(user)); // store the user in the local storage (local storage only stores strings)
                }),
                shareReplay()
            );
    }

    logout() {
        this.subject.next(null); // needs to emit the null value again (back to original state)
        localStorage.removeItem(AUTH_DATA); // clears the local storage
    }

}