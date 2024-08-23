import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
    constructor() {
        console.log('Loading service created');
     }

    private loadingSubject = new BehaviorSubject<boolean>(false); // a subject is similar to an observable but is more like a two way communication channel, whereas an observable is a one way broadcast

    loading$: Observable<boolean> = this.loadingSubject.asObservable();  // true when loading, false when not loading

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null)
            .pipe(
                tap(() => this.loadingOn()),
                concatMap(() => obs$),
                finalize(() => this.loadingOff())
            )
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }


}