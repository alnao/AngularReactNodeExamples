import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-routing',
  templateUrl: './error-routing.component.html',
  styleUrls: ['./error-routing.component.css']
})
export class ErrorRoutingComponent implements OnInit {

  constructor() { }

  errorMessage = 'Risorsa non disponibile';

  ngOnInit() {
  }

}
