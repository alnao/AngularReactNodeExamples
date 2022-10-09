import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articolo } from 'src/app/articoli/articoli.component';

@Injectable({
  providedIn: 'root'
})
export class ArticoliDataService {
  server ="localhost";
  porta ="5051";
  api="api";
  service="articoli";
  
  constructor(private httpClient:HttpClient) { }

  getArticoliByDesc(descrizione : string) {// usate le `` per usare {descrizione}
    return this.httpClient.get<Articolo[]>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/cerca/descrizione/${descrizione}`);
  }

  getArticoliByCodArt(codArt : string) {// usate le `` per usare {descrizione}
    return this.httpClient.get<Articolo>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/cerca/codice/${codArt}`);
  }  

  getArticoliByBarCode(barCode : string) {// usate le `` per usare {descrizione}
    return this.httpClient.get<Articolo>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/cerca/ean/${barCode}`);
  }  

  delArticoloByCodArt(codArt : string){
    return this.httpClient.delete<ApiMsg>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/elimina/${codArt}`);
  }
  updateArticol(articolo:Articolo){
    return this.httpClient.put<ApiMsg>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/modifica`,articolo);
  }
  insArticol(articolo:Articolo){
    return this.httpClient.post<ApiMsg>
    (`http://${this.server}:${this.porta}/${this.api}/${this.service}/inserisci`,articolo);
  }
}
export class ApiMsg{
  constructor(
    public code : string,
    public message : string
  ){};
}