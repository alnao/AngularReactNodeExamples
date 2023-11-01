import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FilmsServiceService {
  constructor(private http: HttpClient) { }
  getHeaderWithToken(): HttpHeaders{
    const tokenJwt=environment.tokenJwt; //TODO: togliere la password del token
    const headers= new HttpHeaders()
      .set('Authorization', tokenJwt)
      //.set('Access-Control-Allow-Origin','*')
      //.set('Access-Control-Allow-Methods','*')
      //.set('Access-Control-Allow-Headers','*')
      ;
    return headers;
  }
  getConfigEndpoint(){
    return environment.filmsEndpoint;
  }
  getList() : Observable<FilmElement[]>{//
    return this.http.get<FilmElement[]>( this.getConfigEndpoint() , { 'headers': this.getHeaderWithToken() } );
  }
  sendFilm(e : FilmElement){
    let bodystr = JSON.stringify(e);
    return this.http.post<string[]>( this.getConfigEndpoint(), bodystr , { 'headers': this.getHeaderWithToken() } );
  }
  deleteFilm(e : FilmElement){
    return this.http.delete<string[]>( this.getConfigEndpoint(),  { 'headers': this.getHeaderWithToken(), 'body' : e } );
  }
}
export interface FilmElement{
  id: string;
  name: string ;
  releaseDate : string | null;
  distributor : string |null;
  genre: string |null;
  lastModified: string |null;
}