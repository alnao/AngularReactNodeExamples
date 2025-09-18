import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ToolbarPage } from '../toolbar/toolbar.page';

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.page.html',
  styleUrls: ['./contatti.page.scss'],
  standalone: true,
  imports: [IonicModule, ToolbarPage]
})
export class ContattiPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openWebsite() {
    window.open('https://alnao.it', '_blank');
  }

}
