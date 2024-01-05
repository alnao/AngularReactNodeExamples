import { Component, OnInit } from '@angular/core';
import { FilmElement, FilmsServiceService } from '../service/films-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {
  film : FilmElement = {'id':'','name':'','releaseDate':null,'distributor':null,'genre':null,'lastModified':null};
  filmForm = new FormGroup({
    name: new FormControl('', [      Validators.required,      Validators.minLength(3)    ]),
    distributor:  new FormControl(''),
    genre:  new FormControl(''),
    releaseDate: new FormControl('', [Validators.required, Validators.pattern("[0-9]{2}[/][0-9]{2}[/][0-9]{4}") ] )
  });

  constructor(private activatedRoute: ActivatedRoute,private router: Router,private service: FilmsServiceService) { }
  
  ngOnInit(): void {
    this.film.id=this.activatedRoute.snapshot.params['id'];
    this.film.name=this.activatedRoute.snapshot.params['name'];
    this.film.releaseDate=this.activatedRoute.snapshot.params['releaseDate'];
    this.film.distributor=this.activatedRoute.snapshot.params['distributor'];
    this.film.genre=this.activatedRoute.snapshot.params['genre'];
    this.film.lastModified=this.activatedRoute.snapshot.params['lastModified'];

    this.filmForm.controls['name'].setValue(this.film.name);
    this.filmForm.controls['distributor'].setValue(this.film.distributor);
    this.filmForm.controls['genre'].setValue(this.film.genre);
    this.filmForm.controls['releaseDate'].setValue(this.film.releaseDate);
  }
  save(){
    this.film.name=""+this.filmForm.value.name;
    this.film.releaseDate=""+this.filmForm.value.releaseDate;
    this.film.distributor=""+this.filmForm.value.distributor;
    this.film.genre=""+this.filmForm.value.genre;
    this.service.sendFilm(this.film).subscribe ( (res : any) =>{console.log(res);
      this.router.navigate(['/lista']);
    },(error) => { console.log(error);
      alert("Errore: " + error.message);
    });
  }
  delete(){
    if (this.film.id ===''){return false;}
    this.service.deleteFilm(this.film).subscribe ( (res : any) =>{console.log(res);
      this.router.navigate(['/']);
    },(error) => { console.log(error);
      alert("Errore: " + error.message);
    });
    return;
  }

}
