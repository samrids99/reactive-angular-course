import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoadingService {
    constructor() { }

    private loadingSubject = new BehaviorSubject<boolean>(false); // a subject is similar to an observable but is more like a two way communication channel, whereas an observable is a one way broadcast

    loading$: Observable<boolean> = this.loadingSubject.asObservable();  // true when loading, false when not loading

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return undefined;
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }


}