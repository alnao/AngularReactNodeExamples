import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <div class="card bg-dark text-white mb-1 mr-1">
    <div class="card-body overflow-hidden" >
      Footer - Alnao.it (c) 2022 - AngularBookExample
    </div>
  </div>  
  `,
  styles: []
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
