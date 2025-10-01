import { Injectable } from '@angular/core';
import { Book } from '../componets/book/book.component';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  urlApi: string = environment.urlApi;
  urlApiPhp: string = environment.urlApiPhp;
  private usePhpApi = environment.usePhpApi;

  
  constructor(private http: HttpClient) { }

  private getApiUrl(): string {
    return this.usePhpApi ? this.urlApiPhp : this.urlApi;
  }

  getAll(): Observable<Book[]>{
    const apiUrl = this.getApiUrl();
    return this.http.get<Book[]>(apiUrl);
  }
  delete(id : number): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.delete<Book>(`${apiUrl}?id=${id}`)
  }
  insert(form : any): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.post<Book>(apiUrl, form.value)
  }
  update(form : any, id : number): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.put<Book>(`${apiUrl}?id=${id}`, form.value)
  }
  getId(id : string): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.get<Book>(`${apiUrl}?id=${id}`);
  }
 
}
