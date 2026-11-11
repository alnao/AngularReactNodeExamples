import { Component, OnInit } from '@angular/core';
import { ArticoliDataService } from '../services/data/articoli-data.service';
import { NumberSymbol } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articoli',
  templateUrl: './articoli.component.html',
  styleUrls: ['./articoli.component.css']
})
export class ArticoliComponent implements OnInit {
  articoli : Articolo[];
  articolo : Articolo;
  numArt : number;
  pagina :number=1;
  righe : number=10;
  filter : string;
  messaggioEsito : string;
  constructor(private articoliService: ArticoliDataService, private route:ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.filter = this.route.snapshot.params['filter'];
    if (this.filter!=undefined){
      this.loadArticoli();
    }
  }
  loadArticoli(){//prima per codice articolo, poi per descrizione, poi per barCode
    this.numArt=0;
    this.articoli= [];//svuotare array
    this.articoliService.getArticoliByCodArt(this.filter).subscribe(
        response => {
          console.log("ricerca per codice articolo");
          this.articolo=response;
          this.articoli.push(this.articolo);
          this.numArt=this.articoli.length;
      }, error =>{ 
        console.log(error.error.messaggio);
        console.log("ricerca per descrizione articolo");
        this.articoliService.getArticoliByDesc(this.filter).subscribe(
          response => {console.log("ricerca per codice articolo");
            this.articoli=response;
            this.numArt=this.articoli.length;
          }, error =>{
            console.log(error.error.messaggio);
          }
        );
      }
    );
  }
  elimina(codArt : string){
    console.log("Eliminazione " + codArt);
    this.articoliService.delArticoloByCodArt(codArt).subscribe(
      response => {
        console.log("Articolo cancellato");
        this.messaggioEsito=response.code + response.message;
        console.log(response);
        this.loadArticoli();
      }, error =>{ 
        console.log(error.error.messaggio); 
      }
    );
  }
  modifica(codArt : string){
    console.log("Modifica "+codArt);
    this.router.navigate(['editart',codArt]);
  }

}
export class Articolo {
  constructor(
    public codArt: string,
    public descrizione: string,
    public um : string,
    public pzCart : number,
    public pesoNetto : number,
    public prezzo : number,
    public idStatoArt : string,
    public dataCreaz : Date,
    public famAssort : FamAss,
    public iva : Iva
  ) { 
  }
}
export class Iva{
  constructor(
    public idIva: number,
    public descrizione: string,
    public aliquota :number
  ){}  
}

export class FamAss {
  constructor(
    public id: number,
    public descrizione: string
  ){}
}


  /*articoli = [
    new Articolo('1','Farina','KM',1,14,4,true,new Date()),
    new Articolo('2','Pasta','KM',0.5,12,3,true,new Date())
    //{codart : '014600301', descrizione : 'BARILLA FARINA 1 KG', um : 'PZ', pzcart : 24, peso : 1, prezzo : 1.09},
    //{codart : "013500121", descrizione : "BARILLA PASTA GR.500 N.70 1/2 PENNE", um : "PZ", pzcart : 30, peso : 0.5, prezzo : 1.3},
    //{codart : "007686402", descrizione : "FINDUS FIOR DI NASELLO 300 GR", um : "PZ", pzcart : 8, peso : 0.3, prezzo : 6.46},
    //{codart : "057549001", descrizione : "FINDUS CROCCOLE 400 GR", um : "PZ", pzcart : 12, peso : 0.4, prezzo : 5.97}
  ];*/