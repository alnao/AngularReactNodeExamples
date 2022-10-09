import { Observable } from 'rxjs';
import { PokemonApiService, IResult, IPokemon } from './../services/pokemon-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, LoadingController , ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Inserito nei preferiti',
      duration: 2000, color:'primary'
    });
    toast.present();
  }


  filter($event){console.log ($event.target.value);
    this.pokemon$ = this.service.getPokemon($event.target.value);
  }
  clearFilter($event){console.log ("Clear");
    this.pokemon$ = this.service.getPokemon("");
  }

  async addToFavorites(pok: IPokemon){
    this.service.addPokemonFavorite(pok);
    this.elencoFavoriti = await this.service.getFavoritesPokemon();
    this.pokList.closeSlidingItems();
    this.presentToast();
  }

  pokIsOnFavorites(pok: IPokemon){
    if (pok === undefined || pok == null) {return false;}
    return (this.elencoFavoriti.filter(el => el.name===pok.name)).length>0;
  }
}
