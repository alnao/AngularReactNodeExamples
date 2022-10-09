import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <a routerLink="book">Lista libri</a>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
