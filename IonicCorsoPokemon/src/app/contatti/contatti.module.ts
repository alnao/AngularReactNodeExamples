import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContattiPageRoutingModule } from './contatti-routing.module';

import { ContattiPage } from './contatti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContattiPageRoutingModule
  ],
  declarations: [ContattiPage]
})
export class ContattiPageModule {}
