import { Observable } from 'rxjs';
import { PokemonApiService, IResult, IPokemon } from './../services/pokemon-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, LoadingController , ToastController, IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarPage } from '../toolbar/toolbar.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ToolbarPage]
})
export class HomePage implements OnInit {
  constructor(public service : PokemonApiService,private loading:LoadingController, private toastController: ToastController) { }
  async presentLoading(){
    const loading = await this.loading.create({
      //cssClass:'my-custom-class'      ,
      message:'Loading ',
      duration : 20000
    });//loading.present();
    return loading;
  }
  loadingC$ : any;//Promise<HTMLIonLoadingElement>;
  pokemon$:  Observable<IResult> ;
  elencoFavoriti : IPokemon[];
  @ViewChild(IonList) pokList: IonList;

  async ngOnInit() {
    this.loadingC$= await this.presentLoading();//
    await this.loadingC$.present();
    this.pokemon$ = this.service.getPokemon("");
    this.pokemon$.subscribe(() => {this.loadingC$.dismiss();console.log(this.pokemon$);});
    this.elencoFavoriti=[];
  }
  async ionViewDidEnter() {//meglio usare ionViewDidEnter, perchè se già inizializzata non verrebbe aggiornata
    this.elencoFavoriti = await this.service.getFavoritesPokemon();
  }
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      color: color,
      position: 'bottom'
    });
    toast.present();
  }


  filter($event: any){console.log ($event.target.value);
    this.pokemon$ = this.service.getPokemon($event.target.value);
  }
  clearFilter($event: any){console.log ("Clear");
    this.pokemon$ = this.service.getPokemon("");
  }

  async addToFavorites(pok: IPokemon){
    const success = await this.service.addPokemonFavorite(pok);
    if (success) {
      this.elencoFavoriti = await this.service.getFavoritesPokemon();
      this.pokList.closeSlidingItems();
      this.presentToast(`${pok.name} aggiunto ai preferiti! ⭐`, 'success');
    } else {
      this.presentToast(`${pok.name} è già nei preferiti`, 'warning');
    }
  }

  pokIsOnFavorites(pok: IPokemon){
    if (pok === undefined || pok == null) {return false;}
    return (this.elencoFavoriti.filter(el => el.name===pok.name)).length>0;
  }
}
