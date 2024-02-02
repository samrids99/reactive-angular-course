import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Lesson} from '../model/lesson';


@Injectable({
    providedIn:'root'
})
export class CoursesService {

    constructor(private http:HttpClient) {

    }

    loadCourseById(courseId:number) {
       return this.http.get<Course>(`/api/courses/${courseId}`)
            .pipe(
              shareReplay()
            )
         .toPromise();
    }

    loadAllCourseLessons(courseId:number) {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: "10000",
                courseId: courseId.toString()
            }
        })
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            )
          .toPromise();
    }

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>("/api/courses")
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }

    loadCoursesPerCategory(category:string){
        return this.http.get<Course[]>("/api/courses")
            .pipe(
                map(res => res["payload"]),
                map(courses => courses.filter(course => course.category == category).sort(sortCoursesBySeqNo)),
                shareReplay()

            ).toPromise();
    }


    saveCourse(courseId:string, changes: Partial<Course>):Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }


    searchLessons(search:string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: "100"
            }
        })
            .pipe(
                map(res => res["payload"]),
                shareReplay()
            );
    }


}







