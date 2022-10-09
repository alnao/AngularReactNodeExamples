import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalutiService } from '../services/data/saluti.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  //messaggio="Welcome message";
  saluti = "Benvenuti nel sito alphashop";
  saluti2 = "Bentornato sig.";
  nomeUtenteVar = '';
  constructor(private route : ActivatedRoute, private salutiService :SalutiService) { 
    
  }
  ngOnInit() {
    this.nomeUtenteVar=this.route.snapshot.params['nomeUtente'];
  }
  getSaluti(){
    this.salutiService.getSaluti(this.nomeUtenteVar).subscribe(
      response => this.getSalutiResponse(response) //caso response
      , error => this.getSalutiError(error) //caso error
    );
  }
  getSalutiResponse(response){ //metodo ok
    this.saluti=response;//così perchè stringa
  }
  getSalutiError(error){ //metodo errore
    console.log(error);
    this.saluti=error.error.message;
  }

}
