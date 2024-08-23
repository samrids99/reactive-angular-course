import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, share, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {


    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient, private loading: LoadingService, private messages: MessagesService) {
        this.loadAllCourses();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue();

        const index = courses.findIndex(course => course.id == courseId);

        const newCourse: Course = {
            ...courses[index],
            ...changes
        };

        const newCourses: Course[] = courses.slice(0);   // creates a new copy of the array
        newCourses[index] = newCourse;

        this.subject.next(newCourses); // emits the new value to the rest of the application    

        return this.http.put(`/api/courses/${courseId}`, changes) // save the changes to the server
            .pipe(
                catchError(err => {
                    const message = "couldn't save the course";
                    console.log(message, err);
                    this.messages.showErrors(message);
                    return throwError(err);
                }),
                shareReplay()
            );
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo)
                )
            )
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    console.log(message, err);
                    this.messages.showErrors(message);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))

            );

        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }



}