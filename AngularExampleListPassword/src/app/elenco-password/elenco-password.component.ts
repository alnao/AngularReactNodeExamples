import { Component, OnInit } from '@angular/core';
import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-elenco-password',
  templateUrl: './elenco-password.component.html',
  styleUrls: ['./elenco-password.component.css']
})
export class ElencoPasswordComponent implements OnInit {
  elenco : ElencoPassword[];
  constructor(private http:HttpClient){
    http.get<ElencoPassword[]>(
      //'http://localhost:5000/api/password/all'
      'http://alnaopassext-env-1.eba-gw5sqime.us-east-2.elasticbeanstalk.com/api/password/all'
      ) 
       .subscribe(res =>{
         console.log(res);
        this.elenco=res;//cast non serve perchè la get è definita come <Tipo>
      });
  }
  ngOnInit(): void {  }
}

export class ElencoPassword{
  codArt : number;
  nome : string;
  utente : string;
  valore: string;
  descrizione : string;
  ordine : number;
}