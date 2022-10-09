import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss'],
})
export class DettaglioComponent implements OnInit {

  constructor(private router:Router) { }
  ngOnInit() {}
  goBack(event){
    this.router.navigate(['users']);
  }
}
