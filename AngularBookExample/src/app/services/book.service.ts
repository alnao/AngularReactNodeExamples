import { Injectable } from '@angular/core';
import { Book } from '../componets/book/book.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  urlApiAzure: string = environment.urlApiAzure;
  private tipoApi = environment.tipoApi;
  private usePhpApi: boolean;
  private useAwsApi: boolean;
  private useAzureApi: boolean;
  private useStaticApi: boolean;
  
  constructor(private http: HttpClient) { }

  // Chiave dei backend cloud: x-api-key per AwsLambdaBooks su AWS, x-functions-key per
  // AzureFunctionBooks su Azure. In locale le chiavi sono vuote e l'header non si invia.
  private options(): { headers?: HttpHeaders } {
    if (this.useAwsApi && environment.apiKeyAws) {
      return { headers: new HttpHeaders({ 'x-api-key': environment.apiKeyAws }) };
    }
    if (this.useAzureApi && environment.apiKeyAzure) {
      return { headers: new HttpHeaders({ 'x-functions-key': environment.apiKeyAzure }) };
    }
    return {};
  }

  private getApiUrl(): string {
    this.usePhpApi = this.tipoApi === "PHP";
    this.useAwsApi = this.tipoApi === "AWS";
    this.useAzureApi = this.tipoApi === "Azure";
    this.useStaticApi = this.tipoApi === "Static";
    if (this.usePhpApi) return this.urlApiPhp;
    if (this.useAwsApi) return this.urlApiAws;
    if (this.useAzureApi) return this.urlApiAzure;
    return this.urlApiStatic;
  }

  getAll(): Observable<Book[]>{
    const apiUrl = this.getApiUrl();
    if (this.usePhpApi || this.useStaticApi ) {
      // PHP API ritorna direttamente un array
      return this.http.get<Book[]>(apiUrl);
    } else {
      // AWS Lambda e Azure Functions ritornano { books: [...] }
      return this.http.get<{books: Book[]}>(apiUrl, this.options()).pipe(
        map(response => response.books || [])
      );
    }
  }
  delete(id : Book['id']): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.delete<Book>(`${apiUrl}/${id}`, this.options());
  }
  insert(form : any): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.post<Book>(apiUrl, form.value, this.options());
  }
  update(form : any, id : Book['id']): Observable<Book>{
    const apiUrl = this.getApiUrl();
    return this.http.put<Book>(`${apiUrl}/${id}`, form.value, this.options());
  }
  getId(id : string): Observable<Book>{
    const apiUrl = this.getApiUrl();
    if (this.usePhpApi || this.useStaticApi ) {
      return this.http.get<Book>(`${apiUrl}?id=${id}`);
    } else {
      // AWS Lambda e Azure Functions usano REST standard: GET /books/{id}
      return this.http.get<Book>(`${apiUrl}/${id}`, this.options());
    }
  }
 
}
