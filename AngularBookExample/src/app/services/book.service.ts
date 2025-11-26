import { Injectable } from '@angular/core';
import { Book } from '../componets/book/book.component';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  urlApiAws: string = environment.urlApiAws;
  urlApiPhp: string = environment.urlApiPhp;
  urlApiStatic: string = environment.urlApiStatic;
  private tipoApi = environment.tipoApi;
  private usePhpApi: boolean;
  private useAwsApi: boolean;
  private useStaticApi: boolean;
  
  constructor(private http: HttpClient) { }

  private getApiUrl(): string {
    this.usePhpApi = this.tipoApi === "PHP";
    this.useAwsApi = this.tipoApi === "AWS";
    this.useStaticApi = this.tipoApi === "Static";
    return this.usePhpApi ? this.urlApiPhp : this.useAwsApi ? this.urlApiAws : this.urlApiStatic ;
  }

  getAll(): Observable<Book[]>{
    const apiUrl = this.getApiUrl();
    if (this.usePhpApi || this.useStaticApi ) {
      // PHP API ritorna direttamente un array
      return this.http.get<Book[]>(apiUrl);
    } else {
      // AWS Lambda ritorna { books: [...] }
      return this.http.get<{books: Book[]}>(apiUrl).pipe(
        map(response => response.books || [])
      );
    }
  }
  delete(id : number): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.delete<Book>(`${apiUrl}/${id}`);
  }
  insert(form : any): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.post<Book>(apiUrl, form.value);
  }
  update(form : any, id : number): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.put<Book>(`${apiUrl}/${id}`, form.value);
  }
  getId(id : string): Observable<Book>{
    const apiUrl = this.getApiUrl();
    if (this.usePhpApi || this.useStaticApi ) {
      return this.http.get<Book>(`${apiUrl}?id=${id}`);
    } else {
      // AWS Lambda usa REST standard: GET /books/{id}
      return this.http.get<Book>(`${apiUrl}/${id}`);
    }
  }
 
}
