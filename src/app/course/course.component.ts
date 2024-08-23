import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError,
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, throwError, combineLatest } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';


interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute, private coursesService: CoursesService) {


  }

  ngOnInit() {
    const courseID = parseInt(this.route.snapshot.paramMap.get("courseId")); // param map always returns a string

    const course$ = this.coursesService.loadCourseById(courseID)
      .pipe(
        startWith(null) // start with null so that the data$ observable is not waiting for the course$ observable to emit
      );

    const lessons$ = this.coursesService.loadAllCourseLessons(courseID)
      .pipe(
        startWith([]) // start with an empty array so that the data$ observable is not waiting for the lessons$ observable to emit
      );

    this.data$ = combineLatest([course$, lessons$]) // combine latest waits for both observables to emit at least once
      .pipe(
        map(([course, lessons]) => {
          return {
            course,
            lessons
          }
        }),
        tap(console.log)
      );
  }


}











