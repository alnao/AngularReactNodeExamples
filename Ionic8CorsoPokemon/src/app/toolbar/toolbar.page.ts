import { Component, OnInit, Input } from '@angular/core';
import { IonicModule} from '@ionic/angular';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.page.html',
  styleUrls: ['./toolbar.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ToolbarPage implements OnInit {

  constructor() { }
  ngOnInit() {}
  @Input() pageTitle="POKEMON";
}
