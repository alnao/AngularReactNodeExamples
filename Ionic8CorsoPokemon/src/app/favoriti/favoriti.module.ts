import { ToolbarPageModule } from './../toolbar/toolbar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritiPageRoutingModule } from './favoriti-routing.module';

import { FavoritiPage } from './favoriti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritiPageRoutingModule,
    ToolbarPageModule,
    FavoritiPage
  ]
})
export class FavoritiPageModule {}
