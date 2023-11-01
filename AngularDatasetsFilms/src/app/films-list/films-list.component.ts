import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FilmElement, FilmsServiceService } from '../service/films-service.service';

@Component({
  selector: 'app-films-list',
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.css']
})
export class FilmsListComponent implements OnInit {
  constructor(private service: FilmsServiceService) { }
  loading : boolean = true;
  listaCompleta :FilmElement[]=[]

  ngOnInit(): void {
    this.service.getList().subscribe(data => { //console.log("film list ok");
      this.listaCompleta=data;
      this.listaCompleta.sort( (a, b) => { //sort by name
        return (''+a.name).localeCompare(''+b.name) ;
      });
      this.loading=false;
    },(error) => { console.log(error);
      alert("Errore: " + error.message);
    });
  }
}
