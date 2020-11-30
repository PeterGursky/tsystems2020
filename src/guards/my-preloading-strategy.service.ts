import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyPreloadingStrategyService implements PreloadingStrategy {

  constructor() { }
  
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.preload) {
      console.log("Loading module in the background: " + route.path);
      return load();
    } 
    return of(null);
  }
}
