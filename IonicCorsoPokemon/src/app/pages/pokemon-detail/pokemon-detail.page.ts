import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { IPokemon, PokemonApiService, DettaglioPok } from './../../services/pokemon-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
})
export class PokemonDetailPage implements OnInit {
  constructor(private router:ActivatedRoute,
      private service:PokemonApiService,
      private loading:LoadingController
      ) { }

  public pok : IPokemon;
  public pokd$ : Observable<DettaglioPok.Dettaglio>;

  async ngOnInit() {
    this.id=this.router.snapshot.paramMap.get('id');
    const name=this.router.snapshot.queryParamMap.get('name');
    const loading=await this.loading.create({message:'Caricamento'});
    await loading.present();
    this.pok=new IPokemon(); //lui usa {name:name,url:...}
    this.pok.name = name;
    this.pok.url=environment.pokemonApi + "/" + this.id;
    this.pokd$=this.service.getDetail(this.pok);
    this.pokd$.subscribe(()=> {loading.dismiss();})

    this.isPokemonInFavorites$=this.service.isPokemonInFavorites(this.pok);
  }
  public isPokemonInFavorites$ : Promise<Boolean>;

  private id :any;
  addToFavorites(){
    this.service.addPokemonFavorite(this.pok);
  }
  share(){

  }
}

