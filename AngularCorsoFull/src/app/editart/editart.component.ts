import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articolo, FamAss, Iva } from '../articoli/articoli.component';
import { ArticoliDataService, ApiMsg } from '../services/data/articoli-data.service';

@Component({
  selector: 'app-editart',
  templateUrl: './editart.component.html',
  styleUrls: ['./editart.component.css']
})
export class EditartComponent implements OnInit {
  codArt : string ='';
  articolo: Articolo;
  conferma : string;
  errore : string;
  apiMsg : ApiMsg;
  isModifica : boolean=false;


  constructor(
      private route:ActivatedRoute
      ,private router : Router
      ,private articoliService:ArticoliDataService
    ) { }

  ngOnInit() {
    this.codArt= this.route.snapshot.params['codArt'];//parametro del routing
    console.log("carico il "+this.codArt);
    if (this.codArt !== "0"){this.isModifica=true;
      this.articoliService.getArticoliByCodArt(this.codArt).subscribe(
        response => {
          this.articolo=response;
          console.log("ricerca per codice articolo" + this.articolo);
          this.errore='';
        }, error =>{
          console.log(error.error.messaggio); 
          this.errore=error.error.messaggio;
        }
      );
    }else{console.log("nuovo articolo")//nuovo
      this.errore='';
      this.articolo=new Articolo(
        "0","","",0,0,0,"2 ",new Date()
        ,new FamAss(-1,"NON DISPONIBILE")
        , new Iva (22,"22",22)
      );
    }
  }
  salva(){console.log("metodo salva di EditartComponent");
    if (this.codArt==="0"){
      this.articoliService.insArticol(this.articolo).subscribe(
        response => {
          console.log("Esito ok " + response.code + response.message);
          this.apiMsg=response;
          this.conferma=response.message;
          this.errore='';
          this.abort();
        }, error =>{
          console.log(error.error.messaggio); 
          this.errore=error.error.messaggio;
        }
      );
    }else{
      this.articoliService.updateArticol(this.articolo).subscribe(
        response => {
          console.log("Esito ok " + response.code + response.message);
          this.apiMsg=response;
          this.conferma=response.message;
          this.errore='';
          this.abort();
        }, error =>{
          console.log(error.error.messaggio); 
          this.errore=error.error.messaggio;
        }
      );
    }
  }
  abort(){
    this.router.navigate(['articoli',this.codArt]);
  }


  public FamAssort = [
    {
      id: -1,
      descrizione: "NON DISPONIBILE"
    },
    {
      id: 1,
      descrizione: "DROGHERIA ALIMENTARE"
    },
    {
      id: 10,
      descrizione: "DROGHERIA CHIMICA"
    },
    {
      id: 15,
      descrizione: "BANCO TAGLIO"
    },
    {
      id: 16,
      descrizione: "GASTRONOMIA"
    },
    {
      id: 17,
      descrizione: "PASTECCERIA"
    },
    {
      id: 20,
      descrizione: "LIBERO SERVIZIO"
    },
    {
      id: 25,
      descrizione: "PANE"
    },
    {
      id: 40,
      descrizione: "SURGELATI"
    },
    {
      id: 50,
      descrizione: "ORTOFRUTTA"
    },
    {
      id: 60,
      descrizione: "MACELLERIA"
    },
    {
      id: 70,
      descrizione: "PESCHERIA"
    },
    {
      id: 90,
      descrizione: "EXTRA ALIMENTARI"
    }

  ];
  public Iva = [
    {id: 22,
    descrizione: "Iva 22%",
    aliquota: 22},
    {id: 10,
      descrizione: "Iva 10%",
      aliquota: 10},
    {id: 4,
    descrizione: "Iva 4%",
    aliquota: 4},
    {id: 0,
      descrizione: "Iva Esente",
      aliquota: 0}
  ];
}
