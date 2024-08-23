import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class LoadingService {
    constructor() { }

    loading$: Observable<boolean>;  // true when loading, false when not loading

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return undefined;
    }

    loadingOn() {

    }

    loadingOff() {

    }


}