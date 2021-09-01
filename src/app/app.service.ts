import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ITable } from './app.helper';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  public excuteQuery(url: string): Observable<ITable> {
    return this.http.get(`${environment.apiDomain}/${url}`).pipe(
      map((d: any) => {
        console.log('d:', Object.keys(d[0]));

        return {
          properties: Object.keys(d[0]),
          records: d
        } as ITable;
      })
    )
  }
}
