import { Component, OnInit, Input } from '@angular/core';
import { MenuController} from '@ionic/angular';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.page.html',
  styleUrls: ['./toolbar.page.scss'],
})
export class ToolbarPage implements OnInit {

  constructor(private menu: MenuController) { }
  ngOnInit() {}
  openMenu(){
    this.menu.open("mainMenu");
  }
  @Input() pageTitle="POKEMON";
}
