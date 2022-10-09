import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<!--app-root-->
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>

  `,
  styles: []
})
export class AppComponent {
  title = 'book';
}
